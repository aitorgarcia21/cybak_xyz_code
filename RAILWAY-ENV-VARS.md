# 🚀 CYBAK - Variables d'Environnement Railway

## Variables à Configurer dans Railway Dashboard

### 🔐 **Supabase (DÉJÀ CONFIGURÉES)**
```
VITE_SUPABASE_URL=https://weixdgectjfbdqazcjdg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlaXhkZ2VjdGpmYmRxYXpjamRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyOTkzMjEsImV4cCI6MjA2ODg3NTMyMX0.5qFaPPGT8420ZtcQUZXVBO7hwmdn7tgYDZpmV_r1NyI
SUPABASE_SERVICE_ROLE_KEY=VOTRE_CLE_SERVICE_ROLE_SUPABASE
```

### 💳 **Stripe (À CONFIGURER)**
```
VITE_STRIPE_PUBLIC_KEY=pk_live_VOTRE_CLE_PUBLIQUE_STRIPE
STRIPE_SECRET_KEY=sk_live_VOTRE_CLE_SECRETE_STRIPE
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET_WEBHOOK
VITE_STRIPE_PRICE_MONTHLY=price_VOTRE_ID_PRODUIT_MENSUEL
```

### 🌐 **Application**
```
NODE_ENV=production
PORT=3000
VITE_APP_URL=https://cybak-security-scanner.up.railway.app
CORS_ORIGINS=https://cybak-security-scanner.up.railway.app
SESSION_SECRET=votre_cle_secrete_session_32_caracteres_minimum
```

## 📋 **Étapes de Configuration**

### 1. **Créer le Produit Stripe**
- Allez sur stripe.com/dashboard
- Products → Add product
- Nom: "CYBAK Premium"
- Prix: 4,99€/mois récurrent
- Notez le Price ID (price_xxxxx)

### 2. **Configurer le Webhook Stripe**
- Webhooks → Add endpoint
- URL: `https://cybak-security-scanner.up.railway.app/api/stripe-webhook`
- Événements: customer.subscription.*, invoice.payment_*
- Notez le Webhook Secret (whsec_xxxxx)

### 3. **Ajouter les Variables dans Railway**
- Railway Dashboard → Variables
- Ajouter toutes les variables ci-dessus
- Redéployer le service

## 🎯 **Commandes Railway**

```bash
# Créer le projet
railway init

# Ajouter les variables (exemple)
railway variables set VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx
railway variables set STRIPE_SECRET_KEY=sk_live_xxxxx

# Déployer
railway up

# Voir les logs
railway logs

# Ouvrir l'app
railway open
```

## ✅ **Vérification Post-Déploiement**

1. **App accessible** : https://cybak-security-scanner.up.railway.app
2. **Inscription fonctionne** : Créer un compte test
3. **Paiement fonctionne** : Tester avec carte Stripe test
4. **Webhook reçu** : Vérifier logs Railway
5. **Base de données** : Utilisateur créé dans Supabase

## 🆘 **En cas de Problème**

```bash
# Voir les logs en temps réel
railway logs --follow

# Redéployer
railway up --detach

# Vérifier les variables
railway variables
```
