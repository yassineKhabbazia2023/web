# App

Le projet `@pulse/app` est une application Single-Page (SPA) Vue 3 qui organise les bibliothèques, applets et packages externes du Front Pulse.

## Architecture de l'application

### Rôle de l'app principale

L'application `@pulse/app` sert de **conteneur orchestrateur** qui :

- **Initialise** l'environnement Vue 3 avec tous les plugins nécessaires
- **Enregistre** dynamiquement toutes les applets métier
- **Configure** le routeur global et les guards de navigation
- **Gère** l'authentification et les sessions utilisateur
- **Coordonne** les bibliothèques partagées (styleguide, common, core)

### Structure des dossiers

L'application est organisée en dossiers fonctionnels :

- **`app/`** : Composant racine et configuration principale
- **`main.ts`** : Point d'entrée et configuration globale
- **`components/`** : Composants spécifiques à l'orchestration
- **`layouts/`** : Squelettes de pages réutilisables
- **`managers/`** : Logique métier de haut niveau (boot, session)
- **`pages/`** : Pages système (erreurs, maintenance)
- **`plugins/`** : Intégrations avec les services externes
- **`router/`** : Routage global et sécurisation des accès
- **`services/`** : Services applicatifs transverses

## Cycle d'initialisation

### 1. Chargement des dépendances (`main.ts`)

L'application suit un **ordre d'initialisation précis** pour garantir le bon fonctionnement :

1. **Plugins externes** : Les services tiers (authentification, analytics, cookies) sont chargés en premier
2. **Bibliothèques communes** : Les services partagés et utilitaires de base
3. **Applets métier** : Chaque module fonctionnel s'enregistre avec accès au routeur
4. **Système de design** : Le styleguide est configuré avec ses assets
5. **Routeur** : Installé en dernier pour capturer toutes les routes des applets

### 2. Configuration du routeur

Le routeur gère :
- **Routes d'erreur** et de maintenance
- **Guards d'authentification** et de feature flags
- **Redirection dynamique** vers la bonne applet selon l'utilisateur
- **Routes des applets** enregistrées dynamiquement

### 3. Gestion de l'état global

- **Stores Pinia** pour l'état utilisateur et les tokens
- **Gestionnaire de session** avec renouvellement automatique
- **Gestion de l'inactivité** avec timeout configurable

## Fonctionnalités principales

### Authentification et sécurité
- Intégration **Gigya** pour l'authentification d'utilisateur Client
- Intégration **MSAL** (SSO) pour l'authentification d'utilisateur Collab
- Renouvellement automatique des tokens pour l'utilisateur Client (déconnexion pour le Collab)
- Gestion de l'inactivité utilisateur
- Guards de navigation sécurisées

### Plugins et services externes
- **Axeptio** : Gestion des cookies et RGPD
- **ProductFruits** : Onboarding, FAQ et tooltips
- **Hubspot** : Chat support et création de tickets
- **Amplitude** : Analytics comportementaux

### Internationalisation
- Support **i18n** avec Vue I18n
- Chargement des traductions par applet
- Locale par défaut et fallbacks

### Gestion des layouts
- Layouts dynamiques selon le contexte
- Layout d'erreur pour la maintenance
- Layouts spécifiques par page (gérés via les meta)

## Scripts disponibles

Référez-vous au `package.json` pour les scripts que vous pouvez exécuter sur ce package.

<<< @/../packages/app/package.json

### Scripts principaux

L'application propose les commandes essentielles pour le développement :

- **Développement** : Serveur local avec rechargement automatique
- **Build** : Compilation optimisée pour la production
- **Tests** : Exécution de la suite de tests avec couverture
- **Qualité** : Vérification et correction automatique du code

## Dépendances

L'application est le **point de convergence** de tout l'écosystème :

### Applets métier
Tous les modules fonctionnels du monorepo sont automatiquement intégrés, permettant une expérience utilisateur unifiée tout en gardant une architecture modulaire.

### Bibliothèques partagées
Les fondations techniques (utilitaires, services, composants UI) sont centralisées pour éviter la duplication et assurer la cohérence.

Cette architecture permet une **modularité maximale** tout en gardant une **cohérence d'ensemble**.