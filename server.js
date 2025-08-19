// server.js - Serveur Express pour CYBAK avec intégration Stripe
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { createClient } from '@supabase/supabase-js'
import securityMiddleware from './middleware/security.js'
import Stripe from 'stripe'
import sqlite3 from 'sqlite3'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_')

const app = express()
const PORT = process.env.PORT || 3000

// Configuration Supabase côté serveur
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Middleware de sécurité
app.use(helmet({
  contentSecurityPolicy: false, // On utilise notre propre CSP
  crossOriginEmbedderPolicy: false
}))
app.use(securityMiddleware)

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.raw({ type: 'application/json' }))

// Servir les fichiers statiques (build Vite)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
app.use(express.static(path.join(__dirname, 'dist')))

// ===========================================
// ROUTES API STRIPE
// ===========================================

// Rate limiter pour Stripe
const stripeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requêtes par fenêtre
  message: { error: 'Trop de tentatives, réessayez plus tard' }
})

// Créer une session de paiement Stripe (avec rate limiting)
app.post('/api/create-checkout-session', stripeRateLimiter, async (req, res) => {
  try {
    const { priceId, userEmail, userId, successUrl, cancelUrl } = req.body

    console.log('Création session Stripe pour:', userEmail)

    // Créer ou récupérer le client Stripe
    let customer
    try {
      const customers = await stripe.customers.list({
        email: userEmail,
        limit: 1
      })
      
      if (customers.data.length > 0) {
        customer = customers.data[0]
      } else {
        customer = await stripe.customers.create({
          email: userEmail,
          metadata: {
            supabase_user_id: userId
          }
        })
      }
    } catch (error) {
      console.error('Erreur création client:', error)
      return res.status(400).json({ error: 'Erreur lors de la création du client' })
    }

    // Créer la session de paiement
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        user_id: userId,
        user_email: userEmail
      },
      subscription_data: {
        metadata: {
          user_id: userId,
          user_email: userEmail
        }
      }
    })

    console.log('Session créée:', session.id)
    res.json({ id: session.id })
  } catch (error) {
    console.error('Erreur Stripe:', error)
    res.status(500).json({ error: error.message })
  }
})

// Vérifier le statut d'un paiement
app.get('/api/check-payment-status', async (req, res) => {
  try {
    const { session_id } = req.query

    if (!session_id) {
      return res.status(400).json({ error: 'Session ID requis' })
    }

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['subscription', 'customer']
    })

    let subscriptionEnd = null
    if (session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription.id)
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString()
    }

    res.json({
      payment_status: session.payment_status,
      customer_id: session.customer.id,
      subscription_id: session.subscription?.id,
      subscription_end: subscriptionEnd,
      plan_type: session.metadata?.plan_type || 'monthly',
      amount_total: session.amount_total,
      currency: session.currency,
      receipt_url: session.receipt_url
    })
  } catch (error) {
    console.error('Erreur vérification paiement:', error)
    res.status(500).json({ error: error.message })
  }
})

// Créer un portail client Stripe (avec rate limiting)
app.post('/api/create-customer-portal', stripeRateLimiter, async (req, res) => {
  try {
    const { customerId, returnUrl } = req.body

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    res.json({ url: portalSession.url })
  } catch (error) {
    console.error('Erreur portail client:', error)
    res.status(500).json({ error: error.message })
  }
})

// Webhook Stripe pour les événements
app.post('/api/stripe-webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Erreur webhook signature:', err.message)
    return res.status(400).send(`Webhook signature verification failed.`)
  }

  console.log('Webhook reçu:', event.type)

  // Gérer les événements Stripe
  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object
        const userId = subscription.metadata.user_id
        
        if (userId) {
          await supabase
            .from('users')
            .update({
              subscription_status: subscription.status,
              stripe_subscription_id: subscription.id,
              subscription_start: new Date(subscription.current_period_start * 1000).toISOString(),
              subscription_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)
        }
        break
        
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object
        const deletedUserId = deletedSubscription.metadata.user_id
        
        if (deletedUserId) {
          await supabase
            .from('users')
            .update({
              subscription_status: 'canceled',
              updated_at: new Date().toISOString()
            })
            .eq('id', deletedUserId)
        }
        break
        
      case 'invoice.payment_succeeded':
        console.log('Paiement réussi pour:', event.data.object.customer)
        break
        
      case 'invoice.payment_failed':
        console.log('Paiement échoué pour:', event.data.object.customer)
        break
        
      default:
        console.log(`Événement non géré: ${event.type}`)
    }
  } catch (error) {
    console.error('Erreur traitement webhook:', error)
    return res.status(500).json({ error: 'Erreur traitement webhook' })
  }

  res.json({ received: true })
})

// ===========================================
// ROUTES API AUTHENTIFICATION
// ===========================================

// Initialiser la base de données
const initDatabase = () => {
  const db = new sqlite3.Database('./cybak.db')
  
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
  })
  
  db.close()
}

// Initialiser la DB au démarrage
initDatabase()

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' })
  }

  jwt.verify(token, process.env.JWT_SECRET || 'cybak-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' })
    }
    req.user = user
    next()
  })
}

// Route de connexion
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' })
    }

    const db = new sqlite3.Database('./cybak.db')
    
    db.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase()], async (err, user) => {
      if (err) {
        db.close()
        return res.status(500).json({ error: 'Erreur serveur' })
      }

      if (!user) {
        db.close()
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
      }

      const validPassword = await bcrypt.compare(password, user.password_hash)
      
      if (!validPassword) {
        db.close()
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
      }

      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          isAdmin: user.is_admin 
        },
        process.env.JWT_SECRET || 'cybak-secret-key',
        { expiresIn: '24h' }
      )

      db.close()

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          isAdmin: user.is_admin
        }
      })
    })
  } catch (error) {
    console.error('Erreur login:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Route d'inscription
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Tous les champs sont requis' })
    }

    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const db = new sqlite3.Database('./cybak.db')
    
    db.run(
      'INSERT INTO users (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)',
      [email.toLowerCase(), hashedPassword, firstName, lastName],
      function(err) {
        if (err) {
          db.close()
          if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({ error: 'Email déjà utilisé' })
          }
          return res.status(500).json({ error: 'Erreur serveur' })
        }

        const token = jwt.sign(
          { 
            userId: this.lastID, 
            email: email.toLowerCase(),
            isAdmin: false 
          },
          process.env.JWT_SECRET || 'cybak-secret-key',
          { expiresIn: '24h' }
        )

        db.close()

        res.status(201).json({
          token,
          user: {
            id: this.lastID,
            email: email.toLowerCase(),
            firstName,
            lastName,
            isAdmin: false
          }
        })
      }
    )
  } catch (error) {
    console.error('Erreur signup:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Route pour obtenir l'utilisateur actuel
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const db = new sqlite3.Database('./cybak.db')
  
  db.get('SELECT * FROM users WHERE id = ?', [req.user.userId], (err, user) => {
    db.close()
    
    if (err || !user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      isAdmin: user.is_admin
    })
  })
})

// ===========================================
// ROUTES FRONTEND (SPA)
// ===========================================

// Health check pour Railway
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Route catch-all pour le SPA React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Gestion des erreurs globales
app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error)
  res.status(500).json({ 
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue'
  })
})

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CYBAK serveur démarré sur le port ${PORT}`)
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`)
  console.log(`💳 Stripe configuré: ${process.env.STRIPE_SECRET_KEY ? '✅' : '❌'}`)
  console.log(`🗄️ Supabase configuré: ${process.env.VITE_SUPABASE_URL ? '✅' : '❌'}`)
})
