# Collaborator

Le projet `@pulse/collaborator` est une application Single-Page (SPA) Vue 3 destinée aux **collaborateurs internes** de Pulse. Cette application est pensée comme une **"vue miroir"** de l'application Customer, avec beaucoup d'écrans similaires tirées des mêmes applets (avec, parfois, des fonctionnalités en plus).

**tl;dr** : [les scripts pour lancer l'app](#scripts-principaux)

::: warning
Attention, pour des raisons de CORS les applications customer et collaborateur sont toutes les deux sur le port 9000 lors du développement local. On ne peut pas lancer les deux en même temps.
:::

## Architecture de l'application

### Rôle de l'app Collaborator

L'application `@pulse/collaborator` sert de **conteneur orchestrateur** pour l'expérience collaborateur qui :

- **Initialise** l'environnement Vue 3 avec tous les plugins nécessaires
- **Enregistre** dynamiquement toutes les applets métier
- **Configure** le routeur global et les guards de navigation
- **Gère** l'authentification collaborateur via **MSAL (SSO)**

### Différences avec l'app Customer

| Aspect | Collaborator | Customer |
|--------|--------------|----------|
| Authentification | MSAL (SSO) | Gigya |
| URL de base | `/collaborateur/` | `/` |
| Utilisateur cible | Collaborateur interne | Client |

### Structure des dossiers

L'application est organisée en dossiers fonctionnels :

- **`src/`** : Code source principal
  - **`main.ts`** : Point d'entrée et configuration globale
  - **`Collaborator.app.vue`** : Composant racine
  - **`router/`** : Routage global et guards spécifiques collaborator
  - **`managers/`** : Logique métier de haut niveau (boot et gestion de l'auth)
  - **`pages/`** : Pages système (authentication, erreurs, maintenance)
  - **`experiences/`** : Composants d'expérience utilisateur collaborator

## Cycle d'initialisation

### 1. Chargement des dépendances (`main.ts`)

L'application suit un **ordre d'initialisation précis** pour garantir le bon fonctionnement :

1. **Plugins externes** : Les services tiers (authentification MSAL, analytics, cookies)
2. **Bibliothèques communes** : Les services partagés et utilitaires de base
3. **Applets métier** : Chaque module fonctionnel s'enregistre avec accès au routeur
4. **Design System** : Le styleguide est configuré avec ses assets
5. **Routeur** : Installé en dernier pour capturer toutes les routes des applets

### 2. Configuration du routeur

Le routeur collaborator gère :
- **Routes d'erreur** et de maintenance
- **Guards d'authentification** spécifiques MSAL
- **Redirection dynamique** vers la bonne applet selon l'utilisateur
- **Routes des applets** enregistrées dynamiquement
- **Base URL** : `/collaborateur/` pour toutes les routes

### 3. Configuration Vite

L'application collaborator a une configuration Vite spécifique :
- **Base URL** : `/collaborateur/` pour servir l'app sous ce chemin
- **SPA Fallback** : Middleware qui redirige les requêtes `/collaborateur/*` vers `index.html`

### 4. Gestion de l'état global

- **Stores Pinia** pour l'état utilisateur et les tokens
- **Gestion de session MSAL** : Déconnexion lors de l'expiration (pas de renouvellement auto)
- **Gestion de l'inactivité** avec timeout configurable

## Fonctionnalités principales

### Authentification et sécurité
- Intégration **MSAL** (Microsoft Authentication Library) pour le SSO collaborateur
- Gestion de la session SSO
- Gestion de l'inactivité utilisateur
- Guards de navigation sécurisées

### Plugins et services externes
- **Axeptio** : Gestion des cookies et RGPD
- **ProductFruits** : Onboarding, FAQ et tooltips
- **Hubspot** : Chat support et création de tickets
- **Amplitude** : Analytics comportementaux

### Gestion des layouts
- Layouts dynamiques selon le contexte
- Layout d'erreur pour la maintenance
- Layouts spécifiques par page (gérés via les meta)

## Scripts disponibles

Référez-vous au `package.json` pour les scripts que vous pouvez exécuter sur ce package.

<<< @/../packages/apps/collaborator/package.json

### Scripts principaux

Depuis le root du monorepo, vous pouvez lancer ces scripts :

- **Développement** : `npm run dev --workspace=@pulse/collaborator` - Serveur local sur http://localhost:9000/collaborateur/
- **Build** : `npm run build --workspace=@pulse/collaborator` - Compilation optimisée pour la production
- **Tests** : `npm run test --workspace=@pulse/collaborator` - Exécution de la suite de tests
- **Qualité** : `npm run lint --workspace=@pulse/collaborator` - Vérification du code

## Configuration MSAL pour le développement local

Pour que l'authentification MSAL fonctionne en local, assurez-vous de configurer les redirections dans votre fichier `env-vars.js` :

```javascript
VITE_API_MSAL_POST_LOGOUT_REDIRECT_URI: "http://localhost:9000/collaborateur",
VITE_API_MSAL_REDIRECT_URI: "http://localhost:9000/collaborateur",
```

## Dépendances

L'application Collaborator intègre l'ensemble des applets métier et bibliothèques partagées du monorepo, avec des fonctionnalités additionnelles comme le booking et le feed center, permettant une expérience collaborateur complète.
