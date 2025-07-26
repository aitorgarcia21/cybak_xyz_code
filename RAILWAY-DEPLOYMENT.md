# 🚀 CYBAK - Guide de Déploiement Railway

## 📋 **Vue d'ensemble**

Ce guide vous accompagne pour déployer CYBAK avec Stripe sur Railway, incluant toutes les variables d'environnement nécessaires.

## 🔧 **Prérequis**

### **1. Comptes Requis**
- ✅ Compte Railway (railway.app)
- ✅ Compte Stripe (stripe.com)
- ✅ Projet Supabase configuré

### **2. Informations à Préparer**
- Clés Stripe (publique + secrète + webhook)
- Identifiants Supabase
- IDs des produits Stripe créés

## 🚀 **Étapes de Déploiement**

### **Étape 1 : Préparation Stripe**

1. **Créer le produit dans Stripe Dashboard** :
   ```
   Produit: CYBAK Premium
   - Prix: 4,99€/mois
   - Type: Abonnement récurrent mensuel
   - ID récurrent: price_xxxxx (noter cet ID)
   ```

2. **Configurer les webhooks** :
   - URL: `https://votre-app.up.railway.app/api/stripe-webhook`
   - Événements: `customer.subscription.*`, `invoice.payment_*`
   - Noter le secret webhook: `whsec_xxxxx`

### **Étape 2 : Déploiement sur Railway**

1. **Connecter le repository** :
   ```bash
   # Pousser le code sur GitHub
   git add .
   git commit -m "Préparation déploiement Railway avec Stripe"
   git push origin main
   ```

2. **Créer le projet Railway** :
   - Aller sur railway.app
   - "New Project" → "Deploy from GitHub repo"
   - Sélectionner votre repository CYBAK

3. **Configurer les variables d'environnement** :

### **Étape 3 : Variables d'Environnement Railway**

Dans Railway Dashboard → Settings → Environment Variables :

#### **🔐 Supabase Configuration**
```env
VITE_SUPABASE_URL=https://weixdgectjfbdqazcjdg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlaXhkZ2VjdGpmYmRxYXpjamRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyOTkzMjEsImV4cCI6MjA2ODg3NTMyMX0.5qFaPPGT8420ZtcQUZXVBO7hwmdn7tgYDZpmV_r1NyI
SUPABASE_SERVICE_ROLE_KEY=VOTRE_CLE_SERVICE_ROLE_SUPABASE
```

#### **💳 Stripe Configuration**
```env
VITE_STRIPE_PUBLIC_KEY=pk_live_VOTRE_CLE_PUBLIQUE_STRIPE
STRIPE_SECRET_KEY=sk_live_VOTRE_CLE_SECRETE_STRIPE
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET_WEBHOOK
VITE_STRIPE_PRICE_MONTHLY=price_VOTRE_ID_PRODUIT_MENSUEL
```

#### **🌐 Application Configuration**
```env
NODE_ENV=production
PORT=3000
VITE_APP_URL=https://votre-app.up.railway.app
CORS_ORIGINS=https://votre-app.up.railway.app
SESSION_SECRET=votre_cle_secrete_session_32_caracteres_minimum
```

#### **📊 Analytics (Optionnel)**
```env
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://votre-sentry-dsn
```

### **Étape 4 : Configuration Build Railway**

Railway détectera automatiquement :
- `package.json` avec les scripts `railway:build` et `railway:start`
- `railway.json` pour la configuration
- `server.js` comme point d'entrée

### **Étape 5 : Vérification Post-Déploiement**

1. **Tester l'application** :
   - Accéder à `https://votre-app.up.railway.app`
   - Vérifier que la page d'accueil se charge
   - Tester l'inscription → pricing → paiement

2. **Vérifier les logs Railway** :
   ```
   ✅ Serveur démarré sur le port 3000
   ✅ Stripe configuré
   ✅ Supabase configuré
   ```

3. **Tester les webhooks Stripe** :
   - Effectuer un paiement test
   - Vérifier dans Railway logs que le webhook est reçu
   - Confirmer la mise à jour dans Supabase

## 🔍 **Résolution de Problèmes**

### **Erreurs Communes**

#### **1. Erreur "Stripe key not found"**
```
Solution: Vérifier VITE_STRIPE_PUBLIC_KEY dans Railway
```

#### **2. Erreur "Supabase connection failed"**
```
Solution: Vérifier VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
```

#### **3. Erreur "Webhook signature verification failed"**
```
Solution: Vérifier STRIPE_WEBHOOK_SECRET correspond au webhook Stripe
```

#### **4. Erreur "Port already in use"**
```
Solution: Railway gère automatiquement le PORT, ne pas le forcer
```

### **Debugging**

1. **Logs Railway** :
   ```bash
   # Voir les logs en temps réel
   railway logs --follow
   ```

2. **Variables d'environnement** :
   ```bash
   # Lister toutes les variables
   railway variables
   ```

3. **Test local** :
   ```bash
   # Tester avant déploiement
   npm run build
   npm run start
   ```

## 📊 **Monitoring et Maintenance**

### **Métriques à Surveiller**
- **Uptime** : Disponibilité de l'application
- **Response time** : Temps de réponse des pages
- **Payment success rate** : Taux de réussite des paiements
- **Error rate** : Taux d'erreur global

### **Logs Importants**
- **Paiements Stripe** : Succès/échecs
- **Webhooks** : Réception et traitement
- **Erreurs Supabase** : Connexion et requêtes
- **Erreurs serveur** : 500, timeouts, etc.

### **Mises à jour**
```bash
# Déploiement d'une nouvelle version
git add .
git commit -m "Nouvelle fonctionnalité"
git push origin main
# Railway redéploie automatiquement
```

## 🎯 **Checklist Final**

### **Avant le Lancement**
- [ ] Toutes les variables d'environnement configurées
- [ ] Produits Stripe créés et IDs notés
- [ ] Webhooks Stripe configurés avec bonne URL
- [ ] Tests de paiement en mode test réussis
- [ ] Schéma Supabase appliqué (users, audits, etc.)
- [ ] RLS policies Supabase activées

### **Après le Lancement**
- [ ] Tests de paiement en mode live
- [ ] Monitoring des logs activé
- [ ] Analytics configuré
- [ ] Support client préparé
- [ ] Documentation utilisateur mise à jour

## 🆘 **Support**

### **En cas de problème**
1. **Vérifier les logs Railway** en premier
2. **Tester les variables d'environnement** une par une
3. **Consulter la documentation Stripe/Supabase**
4. **Tester en local** pour isoler le problème

### **Ressources Utiles**
- [Railway Documentation](https://docs.railway.app)
- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

---

## ✅ **Résumé**

CYBAK est maintenant prêt pour un déploiement complet sur Railway avec :
- ✅ **Frontend React** optimisé
- ✅ **Backend Express.js** avec API Stripe
- ✅ **Base de données Supabase** sécurisée
- ✅ **Paiements Stripe** intégrés
- ✅ **Variables d'environnement** configurées
- ✅ **Monitoring** et logs

**🎉 Votre SAAS CYBAK est prêt à générer des revenus !**
