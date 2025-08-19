from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import sqlite3
import bcrypt
import jwt
import datetime
import os
import re
import secrets
from functools import wraps
from urllib.parse import urlparse
from security_middleware import add_security_headers, check_request_size, advanced_rate_limit

app = Flask(__name__)

# Security configurations
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', secrets.token_urlsafe(32))
app.config['JWT_EXPIRATION_HOURS'] = int(os.environ.get('JWT_EXPIRATION_HOURS', '24'))
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max request size

# CORS configuration - restrictive for production
if os.environ.get('FLASK_ENV') == 'production':
    CORS(app, origins=['https://cybak.xyz'], supports_credentials=True)
else:
    CORS(app, origins=['http://localhost:5173', 'http://localhost:5174'], supports_credentials=True)

# Rate limiting
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["1000 per hour"]
)

# Input validation functions
def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    # At least 8 characters, 1 uppercase, 1 lowercase, 1 digit
    if len(password) < 8:
        return False, "Le mot de passe doit contenir au moins 8 caractères"
    if not re.search(r'[A-Z]', password):
        return False, "Le mot de passe doit contenir au moins une majuscule"
    if not re.search(r'[a-z]', password):
        return False, "Le mot de passe doit contenir au moins une minuscule"
    if not re.search(r'\d', password):
        return False, "Le mot de passe doit contenir au moins un chiffre"
    return True, "Valide"

def validate_url(url):
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc]) and result.scheme in ['http', 'https']
    except:
        return False

def sanitize_input(text, max_length=255):
    if not isinstance(text, str):
        return ""
    # Remove potentially dangerous characters
    sanitized = re.sub(r'[<>"\'\/\\]', '', text)
    return sanitized[:max_length].strip()

# Database initialization with security
def init_db():
    conn = sqlite3.connect('cybak.db', check_same_thread=False)
    conn.execute('PRAGMA foreign_keys = ON')  # Enable foreign key constraints
    conn.execute('PRAGMA journal_mode = WAL')  # Better concurrency
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            first_name TEXT,
            last_name TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            subscription_status TEXT DEFAULT 'free',
            plan_type TEXT DEFAULT 'free',
            is_admin BOOLEAN DEFAULT 0
        )
    ''')
    
    # Audits table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS audits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            url TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            results TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# JWT token verification decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token manquant'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(
                token, 
                app.config['SECRET_KEY'], 
                algorithms=['HS256'],
                issuer='cybak-api'
            )
            current_user_id = data['user_id']
            
            # Additional security checks
            if not isinstance(current_user_id, int) or current_user_id <= 0:
                return jsonify({'error': 'Token invalide'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expiré'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token invalide'}), 401
        except Exception:
            return jsonify({'error': 'Erreur d\'authentification'}), 401
        
        return f(current_user_id, *args, **kwargs)
    return decorated

# Admin token verification decorator
def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token manquant'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(
                token, 
                app.config['SECRET_KEY'], 
                algorithms=['HS256'],
                issuer='cybak-api'
            )
            current_user_id = data['user_id']
            
            # Check if user is admin
            conn = sqlite3.connect('cybak.db')
            cursor = conn.cursor()
            cursor.execute('SELECT is_admin FROM users WHERE id = ?', (current_user_id,))
            user = cursor.fetchone()
            conn.close()
            
            if not user or not user[0]:
                return jsonify({'error': 'Accès admin requis'}), 403
                
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expiré'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token invalide'}), 401
        except Exception:
            return jsonify({'error': 'Erreur d\'authentification'}), 401
        
        return f(current_user_id, *args, **kwargs)
    return decorated

# Auth endpoints with rate limiting
@app.route('/api/auth/signup', methods=['POST'])
@limiter.limit("5 per minute")
def signup():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Données JSON requises'}), 400
            
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        first_name = sanitize_input(data.get('firstName', ''))
        last_name = sanitize_input(data.get('lastName', ''))
        
        # Validation
        if not email or not password:
            return jsonify({'error': 'Email et mot de passe requis'}), 400
            
        if not validate_email(email):
            return jsonify({'error': 'Format d\'email invalide'}), 400
            
        is_valid, password_msg = validate_password(password)
        if not is_valid:
            return jsonify({'error': password_msg}), 400
            
    except Exception as e:
        return jsonify({'error': 'Données invalides'}), 400
    
    # Hash password
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    try:
        conn = sqlite3.connect('cybak.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO users (email, password_hash, first_name, last_name)
            VALUES (?, ?, ?, ?)
        ''', (email, password_hash, first_name, last_name))
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        # Generate JWT token with shorter expiration
        token = jwt.encode({
            'user_id': user_id,
            'email': email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=app.config['JWT_EXPIRATION_HOURS']),
            'iat': datetime.datetime.utcnow(),
            'iss': 'cybak-api'
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'token': token,
            'user': {
                'id': user_id,
                'email': email,
                'firstName': first_name,
                'lastName': last_name
            }
        }), 201
        
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Email déjà utilisé'}), 409
    except Exception as e:
        app.logger.error(f"Signup error: {str(e)}")
        return jsonify({'error': 'Erreur serveur'}), 500

@app.route('/api/auth/login', methods=['POST'])
@limiter.limit("10 per minute")
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Données JSON requises'}), 400
            
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        # Validation
        if not email or not password:
            return jsonify({'error': 'Email et mot de passe requis'}), 400
            
        if not validate_email(email):
            return jsonify({'error': 'Format d\'email invalide'}), 400
            
    except Exception as e:
        return jsonify({'error': 'Données invalides'}), 400
    
    conn = sqlite3.connect('cybak.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, email, password_hash, first_name, last_name FROM users WHERE email = ?', (email,))
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        # Simulate password check to prevent timing attacks
        bcrypt.checkpw(b'dummy', b'$2b$12$dummy.hash.to.prevent.timing.attacks')
        return jsonify({'error': 'Email ou mot de passe incorrect'}), 401
        
    if not bcrypt.checkpw(password.encode('utf-8'), user[2]):
        return jsonify({'error': 'Email ou mot de passe incorrect'}), 401
    else:
        # Generate JWT token with shorter expiration
        token = jwt.encode({
            'user_id': user[0],
            'email': user[1],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=app.config['JWT_EXPIRATION_HOURS']),
            'iat': datetime.datetime.utcnow(),
            'iss': 'cybak-api'
        }, app.config['SECRET_KEY'], algorithm='HS256')
    
    return jsonify({
        'token': token,
        'user': {
            'id': user[0],
            'email': user[1],
            'firstName': user[3],
            'lastName': user[4]
        }
    }), 200

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user(current_user_id):
    conn = sqlite3.connect('cybak.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, email, first_name, last_name, subscription_status, plan_type FROM users WHERE id = ?', (current_user_id,))
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404
    
    return jsonify({
        'user': {
            'id': user[0],
            'email': user[1],
            'firstName': user[2],
            'lastName': user[3],
            'subscriptionStatus': user[4],
            'planType': user[5]
        }
    }), 200

# Audit endpoints
@app.route('/api/audits', methods=['POST'])
@token_required
def create_audit(current_user_id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Données JSON requises'}), 400
            
        url = data.get('url', '').strip()
        
        # Validation
        if not url:
            return jsonify({'error': 'URL requise'}), 400
            
        if not validate_url(url):
            return jsonify({'error': 'Format d\'URL invalide'}), 400
            
        # Sanitize URL
        url = sanitize_input(url, 2048)
        
    except Exception as e:
        return jsonify({'error': 'Données invalides'}), 400
    
    conn = sqlite3.connect('cybak.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO audits (user_id, url, status)
        VALUES (?, ?, 'pending')
    ''', (current_user_id, url))
    audit_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({
        'audit': {
            'id': audit_id,
            'url': url,
            'status': 'pending'
        }
    }), 201

@app.route('/api/audits', methods=['GET'])
@token_required
def get_user_audits(current_user_id):
    conn = sqlite3.connect('cybak.db')
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, url, status, results, created_at, completed_at
        FROM audits WHERE user_id = ?
        ORDER BY created_at DESC
    ''', (current_user_id,))
    audits = cursor.fetchall()
    conn.close()
    
    audit_list = []
    for audit in audits:
        audit_list.append({
            'id': audit[0],
            'url': audit[1],
            'status': audit[2],
            'results': audit[3],
            'createdAt': audit[4],
            'completedAt': audit[5]
        })
    
    return jsonify({'audits': audit_list}), 200

@app.route('/api/audits/<int:audit_id>', methods=['GET'])
@token_required
def get_audit(current_user_id, audit_id):
    conn = sqlite3.connect('cybak.db')
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, url, status, results, created_at, completed_at
        FROM audits WHERE id = ? AND user_id = ?
    ''', (audit_id, current_user_id))
    audit = cursor.fetchone()
    conn.close()
    
    if not audit:
        return jsonify({'error': 'Audit non trouvé'}), 404
    
    return jsonify({
        'audit': {
            'id': audit[0],
            'url': audit[1],
            'status': audit[2],
            'results': audit[3],
            'createdAt': audit[4],
            'completedAt': audit[5]
        }
    }), 200

# Admin endpoints
@app.route('/api/admin/stats', methods=['GET'])
@admin_required
def get_admin_stats(current_user_id):
    conn = sqlite3.connect('cybak.db')
    cursor = conn.cursor()
    
    # Get user statistics
    cursor.execute('SELECT COUNT(*) FROM users')
    total_users = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*) FROM users WHERE DATE(created_at) = DATE("now")')
    users_today = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*) FROM users WHERE DATE(created_at) >= DATE("now", "-7 days")')
    users_week = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*) FROM users WHERE DATE(created_at) >= DATE("now", "-30 days")')
    users_month = cursor.fetchone()[0]
    
    # Get audit statistics
    cursor.execute('SELECT COUNT(*) FROM audits')
    total_audits = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*) FROM audits WHERE DATE(created_at) = DATE("now")')
    audits_today = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*) FROM audits WHERE DATE(created_at) >= DATE("now", "-7 days")')
    audits_week = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*) FROM audits WHERE DATE(created_at) >= DATE("now", "-30 days")')
    audits_month = cursor.fetchone()[0]
    
    # Get recent registrations by day (last 30 days)
    cursor.execute('''
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM users 
        WHERE DATE(created_at) >= DATE("now", "-30 days")
        GROUP BY DATE(created_at)
        ORDER BY date DESC
    ''')
    registrations_by_day = cursor.fetchall()
    
    conn.close()
    
    return jsonify({
        'users': {
            'total': total_users,
            'today': users_today,
            'week': users_week,
            'month': users_month
        },
        'audits': {
            'total': total_audits,
            'today': audits_today,
            'week': audits_week,
            'month': audits_month
        },
        'registrations_by_day': [{'date': row[0], 'count': row[1]} for row in registrations_by_day]
    }), 200

@app.route('/api/admin/users', methods=['GET'])
@admin_required
def get_all_users(current_user_id):
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)  # Max 100 per page
    search = request.args.get('search', '').strip()
    
    conn = sqlite3.connect('cybak.db')
    cursor = conn.cursor()
    
    # Build query with search
    base_query = '''
        SELECT id, email, first_name, last_name, created_at, subscription_status, plan_type, is_admin
        FROM users
    '''
    
    count_query = 'SELECT COUNT(*) FROM users'
    params = []
    
    if search:
        search_condition = ' WHERE email LIKE ? OR first_name LIKE ? OR last_name LIKE ?'
        base_query += search_condition
        count_query += search_condition
        search_param = f'%{search}%'
        params = [search_param, search_param, search_param]
    
    # Get total count
    cursor.execute(count_query, params)
    total_users = cursor.fetchone()[0]
    
    # Get paginated results
    base_query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    offset = (page - 1) * per_page
    cursor.execute(base_query, params + [per_page, offset])
    
    users = cursor.fetchall()
    conn.close()
    
    user_list = []
    for user in users:
        user_list.append({
            'id': user[0],
            'email': user[1],
            'firstName': user[2],
            'lastName': user[3],
            'createdAt': user[4],
            'subscriptionStatus': user[5],
            'planType': user[6],
            'isAdmin': bool(user[7])
        })
    
    return jsonify({
        'users': user_list,
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': total_users,
            'pages': (total_users + per_page - 1) // per_page
        }
    }), 200

@app.route('/api/admin/users/<int:user_id>/audits', methods=['GET'])
@admin_required
def get_user_audits_admin(current_user_id, user_id):
    conn = sqlite3.connect('cybak.db')
    cursor = conn.cursor()
    
    # Get user info
    cursor.execute('SELECT email, first_name, last_name FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    
    if not user:
        conn.close()
        return jsonify({'error': 'Utilisateur non trouvé'}), 404
    
    # Get user's audits
    cursor.execute('''
        SELECT id, url, status, created_at, completed_at
        FROM audits WHERE user_id = ?
        ORDER BY created_at DESC
    ''', (user_id,))
    audits = cursor.fetchall()
    conn.close()
    
    audit_list = []
    for audit in audits:
        audit_list.append({
            'id': audit[0],
            'url': audit[1],
            'status': audit[2],
            'createdAt': audit[3],
            'completedAt': audit[4]
        })
    
    return jsonify({
        'user': {
            'email': user[0],
            'firstName': user[1],
            'lastName': user[2]
        },
        'audits': audit_list
    }), 200

@app.route('/api/admin/promote/<int:user_id>', methods=['POST'])
@admin_required
def promote_user_to_admin(current_user_id, user_id):
    conn = sqlite3.connect('cybak.db')
    cursor = conn.cursor()
    
    cursor.execute('UPDATE users SET is_admin = 1 WHERE id = ?', (user_id,))
    
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'error': 'Utilisateur non trouvé'}), 404
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Utilisateur promu administrateur'}), 200

@app.route('/')
def home():
    return jsonify({
        'message': 'CYBAK API Backend',
        'version': '1.0.0',
        'endpoints': {
            'auth': ['/api/auth/signup', '/api/auth/login', '/api/auth/me'],
            'audits': ['/api/audits']
        }
    })

# Create default admin user
def create_default_admin():
    conn = sqlite3.connect('cybak.db')
    cursor = conn.cursor()
    
    # Check if admin exists
    cursor.execute('SELECT id FROM users WHERE is_admin = 1')
    admin_exists = cursor.fetchone()
    
    if not admin_exists:
        # Create default admin
        admin_email = 'aitorgarcia2112@gmail.com'
        admin_password = '21AiPa01....'
        password_hash = bcrypt.hashpw(admin_password.encode('utf-8'), bcrypt.gensalt())
        
        cursor.execute('''
            INSERT INTO users (email, password_hash, first_name, last_name, is_admin)
            VALUES (?, ?, ?, ?, 1)
        ''', (admin_email, password_hash, 'Aitor', 'Garcia'))
        
        conn.commit()
        print(f"Admin créé: {admin_email}")
        print("Compte admin configuré avec vos identifiants personnels")
    
    conn.close()

# Apply security middleware
@app.before_request
def before_request():
    # Check request size
    size_check = check_request_size()
    if size_check:
        return size_check

@app.after_request
def after_request(response):
    return add_security_headers(response)

if __name__ == '__main__':
    init_db()
    create_default_admin()
    # Disable debug in production
    debug_mode = os.environ.get('FLASK_ENV') != 'production'
    app.run(host='0.0.0.0', port=8080, debug=debug_mode)
