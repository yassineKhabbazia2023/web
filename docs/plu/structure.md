# Explications du projet Pulse.Web

Ce projet utilise les **npm workspaces** pour gérer l'ensemble des packages dans un monorepo unifié.

## Organisation des dossiers

### 📁 `packages/` - Le cœur du monorepo
- **`apps/`** : Applications Vue 3 qui servent de conteneurs pour orchestrer tous les modules
  - `customer` : Application client (authentification Gigya, URL: `/`)
  - `collaborator` : Application collaborateur (authentification MSAL SSO, URL: `/collaborateur/`)
- **`applets/`** : Modules métier indépendants et réutilisables
  - `login` : Gestion de l'authentification
  - `ged` : Gestion électronique de documents
  - `entities` : Gestion des entités
  - `mandate` : Gestion des mandats
  - `launcher` : Lanceur d'applications
  - `offers-catalog` : Catalogue d'offres
- **`libraries/`** : Bibliothèques partagées entre les différents packages
  - `toolbox` : Utilitaires TypeScript purs (helpers, types, logger, etc.)
  - `common` : Cœur de l'application (services métier, stores et managers essentiels)
  - `shared` : Composants et layouts partagés agnostiques du métier
  - `styleguide` : Composants UI réutilisables et système de design
  - `widgets` : Fonctionnalités packagées autonomes

## Comment ça fonctionne

Le monorepo Pulse.Web est organisé de manière modulaire :

### Architecture en couches
- **`apps/`** : Les applications hôtes (customer et collaborator) qui orchestrent l'ensemble
- **`applets/`** : Les modules métier qui s'enregistrent auprès des apps
- **`libraries/`** : Les briques de base réutilisées partout

### Gestion des dépendances
- **npm workspaces** : Permet de gérer toutes les dépendances depuis la racine
- **Hoisting** : Les dépendances communes sont partagées automatiquement
- **Versions cohérentes** : Une seule version par dépendance dans tout le monorepo

### Configuration centralisée

Les fichiers de configuration à la racine permettent une gestion unifiée :
- **TypeScript** : `tsconfig.json` avec des alias de chemins pour faciliter les imports
- **ESLint** : `eslint.config.mjs` pour des règles de code cohérentes
- **Vitest** : `vitest.config.ts` pour les tests unitaires

## Pourquoi cette organisation ?

### Avantages de cette structure

1. **Modularité** : Chaque applet peut être développée et testée indépendamment
2. **Réutilisabilité** : Les bibliothèques partagées évitent la duplication de code
3. **Déploiement unifié** : Une seule application finale qui intègre tous les modules
4. **Maintenance simplifiée** : Les mises à jour de dépendances se font en un seul endroit

### Séparation des responsabilités
- **`toolbox`** : Utilitaires TypeScript purs (pas de dépendances Vue)
- **`common`** : Cœur de l'application avec services métier, stores Pinia, et managers essentiels (sans lesquels l'app ne peut fonctionner)
- **`shared`** : Composants et layouts partagés agnostiques du métier (sidebar, layouts home/login/empty)
- **`styleguide`** : Composants UI réutilisables et système de design
- **`widgets`** : Fonctionnalités complètes et autonomes

Cette architecture permet de :
- **Isoler** chaque fonctionnalité dans son propre package
- **Partager** facilement le code entre les différentes parties
- **Tester** et **builder** indépendamment chaque module
- **Déployer** l'ensemble comme une application cohérente
