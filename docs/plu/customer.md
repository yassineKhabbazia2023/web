# Customer

Le projet `@pulse/customer` est une application Single-Page (SPA) Vue 3 destinée aux **clients** de Pulse.

**tl;dr** : [les scripts pour lancer l'app](#scripts-principaux)

::: warning
Attention, pour des raisons de CORS les applications customer et collaborateur sont toutes les deux sur le port 9000 lors du développement local. On ne peut pas lancer les deux en même temps.
:::

## Architecture de l'application

### Rôle de l'app Customer

L'application `@pulse/customer` sert de **conteneur orchestrateur** pour l'expérience client qui :

- **Initialise** l'environnement Vue 3 avec tous les plugins nécessaires
- **Enregistre** dynamiquement toutes les applets métier
- **Configure** le routeur global et les guards de navigation
- **Gère** l'authentification client via **Gigya**

### Différences avec l'app Collaborator

| Aspect | Customer | Collaborator |
|--------|----------|--------------|
| Authentification | Gigya | MSAL (SSO) |
| URL de base | `/` | `/collaborateur/` |
| Utilisateur cible | Client | Collaborateur interne |

### Structure des dossiers

L'application est organisée en dossiers fonctionnels :

- **`src/`** : Code source principal
  - **`main.ts`** : Point d'entrée et configuration globale avec plugin Gigya
  - **`Customer.app.vue`** : Composant racine
  - **`router/`** : Routage global et guards spécifiques customer
  - **`managers/`** : Logique métier de haut niveau (boot et gestion de l'auth)
  - **`pages/`** : Pages système (authentication, anonyme, landing)
  - **`experiences/`** : Composants d'expérience utilisateur customer

## Cycle d'initialisation

### 1. Chargement des dépendances (`main.ts`)

L'application suit un **ordre d'initialisation précis** pour garantir le bon fonctionnement :

1. **Plugin Gigya** : Authentification client chargée en premier
2. **Plugins externes** : Les services tiers (analytics, cookies)
3. **Bibliothèques communes** : Les services partagés et utilitaires de base
4. **Applets métier** : Chaque module fonctionnel s'enregistre avec accès au routeur
5. **Design System** : Le styleguide est configuré avec ses assets
6. **Routeur** : Installé en dernier pour capturer toutes les routes des applets

### 2. Configuration du routeur

Le routeur customer gère :
- **Routes d'erreur** et de maintenance
- **Guards d'authentification** spécifiques Gigya
- **Redirection dynamique** vers la bonne applet selon l'utilisateur
- **Routes des applets** enregistrées dynamiquement

### 3. Gestion de l'état global

- **Stores Pinia** pour l'état utilisateur et les tokens
- **Gestionnaire de session** avec renouvellement automatique des tokens Gigya
- **Gestion de l'inactivité** avec timeout configurable

## Fonctionnalités principales

### Authentification et sécurité
- Intégration **Gigya** pour l'authentification client
- Renouvellement automatique des tokens
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

<<< @/../packages/apps/customer/package.json

### Scripts principaux

Depuis le root du monorepo, vous pouvez lancer ces scripts :

- **Développement** : `npm run dev --workspace=@pulse/customer` - Serveur local sur http://localhost:9000
- **Build** : `npm run build --workspace=@pulse/customer` - Compilation optimisée pour la production
- **Tests** : `npm run test --workspace=@pulse/customer` - Exécution de la suite de tests
- **Qualité** : `npm run lint --workspace=@pulse/customer` - Vérification du code

## Dépendances

L'application Customer intègre l'ensemble des applets métier et bibliothèques partagées du monorepo, permettant une expérience utilisateur unifiée tout en gardant une architecture modulaire.
