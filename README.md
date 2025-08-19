# CYBAK - Security Scanner

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/cybak-security-scanner)

CYBAK est un scanner de sécurité web moderne. Cette application est construite avec Vite+React et utilise Supabase pour l'authentification et la base de données.

## 🚀 Déploiement sur Railway

### Prérequis
- Compte [Railway](https://railway.app)
- Compte [Supabase](https://supabase.com)

### Configuration des variables d'environnement
Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
REACT_APP_SUPABASE_URL=votre_url_supabase
REACT_APP_SUPABASE_ANON_KEY=votre_cle_anonyme_supabase
```

### Déploiement automatique avec GitHub
1. Poussez votre code sur un dépôt GitHub
2. Connectez votre compte GitHub à Railway
3. Importez le projet dans Railway
4. Ajoutez les variables d'environnement dans les paramètres du projet Railway
5. Le déploiement se fait automatiquement à chaque push

## 🛠 Développement local

### Installation des dépendances
```bash
npm install
```

### Démarrage du serveur de développement
```bash
npm run dev
```

### Construction pour la production
```bash
npm run build
```

## 🔄 Déploiement continu
Le projet est configuré pour le déploiement continu avec Railway. À chaque push sur la branche `main` ou `master`, le déploiement est automatiquement effectué sur Railway.

## 📝 Licence
Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus d'informations.

## 📞 Contact
Pour plus d'informations, visitez [cybak.xyz](https://cybak.xyz)
