/**
 * Middleware de sécurité pour CYBAK
 * Ajoute les en-têtes de sécurité HTTP essentiels
 */

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Configuration des en-têtes de sécurité
const securityHeaders = (req, res, next) => {
  // HSTS - Force HTTPS pour 1 an
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Prévention du clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prévention du sniffing MIME
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Protection XSS (legacy mais toujours utile)
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' https://*.supabase.co https://api.stripe.com https://checkout.stripe.com wss://*.supabase.co; " +
    "frame-src 'self' https://checkout.stripe.com https://js.stripe.com; " +
    "object-src 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'; " +
    "frame-ancestors 'none'; " +
    "upgrade-insecure-requests;"
  );
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  res.setHeader('Permissions-Policy', 
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=*, usb=()'
  );
  
  next();
};

// Rate limiting pour prévenir les attaques brute force
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs, // 15 minutes par défaut
    max, // limite de requêtes
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Rate limiter spécifique pour l'authentification
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives max
  message: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes.',
  skipSuccessfulRequests: true,
});

// Rate limiter pour les API Stripe
const stripeRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requêtes par minute
  message: 'Trop de requêtes de paiement, veuillez patienter.',
});

const securityMiddleware = {
  securityHeaders,
  createRateLimiter,
  authRateLimiter,
  stripeRateLimiter,
  helmet
};

export default securityMiddleware;
