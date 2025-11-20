# Admin Tools

Application Vue 3 pour la gestion des variables d'environnement du projet Pulse.

## 🎯 Fonctionnalités

- Gérer les variables d'environnement des différents services Pulse
- Rechercher et filtrer les variables par domaine et environnement
- Authentification via Azure AD (MSAL)
- Vue consolidée des variables (ITG, REC, PRD)

## ⚙️ Configuration initiale

1. Copier le template :
   ```bash
   cp .env-vars.example.js public/env-vars.js
   ```

2. Éditer `public/env-vars.js` avec vos valeurs Azure AD et API

⚠️ **Important** : Le fichier `public/env-vars.js` ne doit jamais être commité

## 🚀 Commandes

```bash
# Développement (http://localhost:9001)
npm run dev

# Build
npm run build
npm run preview

# Tests
npm run test
npm run test:coverage

```

## 🔐 Variables d'environnement

### Requises

| Variable | Description |
|----------|-------------|
| `VITE_MSAL_CLIENT_ID` | Azure AD Application ID |
| `VITE_MSAL_REDIRECT_URI` | URI de redirection après login |
| `VITE_MSAL_POST_LOGOUT_REDIRECT_URI` | URI après déconnexion |
| `VITE_MSAL_AUTHORITY` | URL Azure AD Authority |
| `VITE_API_BASE_URL` | URL de l'API Admin Tools |

### Utilisation

```typescript
import { VITE_MSAL_CLIENT_ID, VITE_API_BASE_URL } from 'env-vars'
```

## 🏗️ Structure

```
packages/admin-tools/
├── public/
│   └── env-vars.js            # Variables runtime (non commité)
├── src/
│   ├── api/                   # Axios + interceptors
│   ├── pages/
│   │   ├── anonymous/         # Login
│   │   └── authenticated/     # Gestion env vars
│   ├── routing/               # Router + guards
│   ├── services/              # MSAL, env vars
│   └── main.ts
├── .env-vars.example.js       # Template
└── vite.config.ts
```

## 📦 Déploiement

1. Build :
   ```bash
   npm run build
   ```

2. Créer `env-vars.js` sur le serveur avec les valeurs de production

3. Configurer les URIs de redirection dans Azure AD :
   - `http://localhost:9001` (local)
   - `https://backoffice.itg.pulse.rydge.fr` (ITG)
   - `https://backoffice.rec.pulse.rydge.fr` (REC)
   - `https://backoffice.pulse.rydge.fr` (PRD)

---

**Maintenu par l'équipe Pulse**
