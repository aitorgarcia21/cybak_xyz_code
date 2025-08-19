# Security middleware for CYBAK Flask backend

from flask import request, jsonify
import time
import hashlib
from functools import wraps

# Security headers middleware
def add_security_headers(response):
    """Add security headers to all responses"""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
    return response

# Request size limiter
def check_request_size():
    """Check if request size is within limits"""
    if request.content_length and request.content_length > 16 * 1024 * 1024:  # 16MB
        return jsonify({'error': 'Requête trop volumineuse'}), 413
    return None

# IP-based rate limiting storage (simple in-memory for demo)
request_counts = {}
blocked_ips = {}

def advanced_rate_limit(max_requests=100, window_minutes=10, block_duration_minutes=30):
    """Advanced rate limiting with IP blocking"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            client_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
            current_time = time.time()
            
            # Check if IP is blocked
            if client_ip in blocked_ips:
                if current_time < blocked_ips[client_ip]:
                    return jsonify({'error': 'IP temporairement bloquée'}), 429
                else:
                    del blocked_ips[client_ip]
            
            # Initialize or clean old requests
            if client_ip not in request_counts:
                request_counts[client_ip] = []
            
            # Remove old requests outside the window
            window_start = current_time - (window_minutes * 60)
            request_counts[client_ip] = [req_time for req_time in request_counts[client_ip] if req_time > window_start]
            
            # Check rate limit
            if len(request_counts[client_ip]) >= max_requests:
                # Block IP
                blocked_ips[client_ip] = current_time + (block_duration_minutes * 60)
                return jsonify({'error': 'Trop de requêtes - IP bloquée temporairement'}), 429
            
            # Add current request
            request_counts[client_ip].append(current_time)
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Request signature validation (for API integrity)
def validate_request_signature(secret_key):
    """Validate request signature for critical operations"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Skip signature validation in development
            if request.headers.get('X-Skip-Signature') == 'development':
                return f(*args, **kwargs)
            
            signature = request.headers.get('X-Request-Signature')
            timestamp = request.headers.get('X-Request-Timestamp')
            
            if not signature or not timestamp:
                return jsonify({'error': 'Signature de requête manquante'}), 401
            
            # Check timestamp (prevent replay attacks)
            try:
                req_time = float(timestamp)
                if abs(time.time() - req_time) > 300:  # 5 minutes tolerance
                    return jsonify({'error': 'Requête expirée'}), 401
            except ValueError:
                return jsonify({'error': 'Timestamp invalide'}), 401
            
            # Validate signature
            request_data = request.get_data()
            expected_signature = hashlib.sha256(
                f"{timestamp}{request.method}{request.path}{request_data.decode('utf-8', errors='ignore')}{secret_key}".encode()
            ).hexdigest()
            
            if signature != expected_signature:
                return jsonify({'error': 'Signature invalide'}), 401
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# SQL injection prevention helpers
def escape_sql_like(value):
    """Escape special characters in LIKE queries"""
    return value.replace('\\', '\\\\').replace('%', '\\%').replace('_', '\\_')

# Input sanitization for database queries
def sanitize_order_by(field, allowed_fields):
    """Sanitize ORDER BY clauses to prevent SQL injection"""
    if field not in allowed_fields:
        return 'id'  # Default safe field
    return field

def sanitize_limit_offset(limit, offset, max_limit=100):
    """Sanitize LIMIT and OFFSET values"""
    try:
        limit = int(limit) if limit else 20
        offset = int(offset) if offset else 0
        
        limit = min(max(1, limit), max_limit)
        offset = max(0, offset)
        
        return limit, offset
    except (ValueError, TypeError):
        return 20, 0
