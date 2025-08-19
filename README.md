# CYBAK - Security Scanner

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Faitorgarcia21%2Fcybak_xyz_code&env=REACT_APP_SUPABASE_URL,REACT_APP_SUPABASE_ANON_KEY&envDescription=Get%20these%20values%20from%20your%20Supabase%20project%20settings&envLink=https%3A%2F%2Fapp.supabase.com%2Fproject%2F_%2Fsettings%2Fapi&project-name=cybak-security-scanner&repo-name=cybak-security-scanner)

CYBAK est un scanner de sécurité web moderne. Cette application est construite avec Vite+React et utilise Supabase pour l'authentification et la base de données.

## 🚀 Déploiement sur Vercel

### Prérequis
- Compte [Vercel](https://vercel.com)
- Compte [Supabase](https://supabase.com)

### Configuration des variables d'environnement
Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
REACT_APP_SUPABASE_URL=votre_url_supabase
REACT_APP_SUPABASE_ANON_KEY=votre_cle_anonyme_supabase
```

### Déploiement automatique avec GitHub
1. Poussez votre code sur un dépôt GitHub
2. Connectez votre compte GitHub à Vercel
3. Importez le projet dans Vercel
4. Ajoutez les variables d'environnement dans les paramètres du projet Vercel
5. Déclenchez un nouveau déploiement

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
Le projet est configuré pour le déploiement continu avec GitHub Actions. À chaque push sur la branche `main` ou `master`, le déploiement est automatiquement effectué sur Vercel.

## 📝 Licence
Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus d'informations.

## 📞 Contact
Pour plus d'informations, visitez [cybak.xyz](https://cybak.xyz)
