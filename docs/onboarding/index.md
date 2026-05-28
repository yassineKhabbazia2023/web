# Onboarding

Bienvenue dans l'équipe Front-End de RYDGE Conseil ! Cette page vous présente les concepts clés et la philosophie du projet Pulse.Web.

## Vue d'ensemble

Pulse est une plateforme SaaS destinée aux experts-comptables et à leurs clients. 
Le projet Front-End se compose de deux applications principales qui partagent une base de code commune.
Le projet propose également un Back-Office technique à destination de l'équipe Pulse (mais pas des collaborateurs).

## Les deux applications

::: tip Attention
En mode développement, on ne peut exécuter qu'une application à la fois.
:::

### Customer

L'application **Customer** est destinée aux clients des cabinets d'expertise comptable. Elle leur permet de :
- Consulter leurs documents comptables
- Récupérer les dernières nouvelles du marché
- Se connecter à l'écosystème RYDGE Conseil et les applications tierces (comme Pennylane ou Ventya)

L'authentification se fait via **Gigya**.

### Collaborator

L'application **Collaborator** est destinée aux collaborateurs des cabinets. Elle leur permet de :
- Gérer les dossiers clients
- Accéder aux outils métier

L'authentification se fait via **MSAL** (SSO Microsoft).

## Architecture modulaire

### Applets

Les fonctionnalités métier sont découpées en **applets** : des micro-packages indépendants qui peuvent être intégrées dans les apps. Chaque applet gère un domaine fonctionnel spécifique (GED, mandats, catalogue d'offres, etc.).

Cette architecture permet :
- Une séparation claire des responsabilités
- Un développement parallèle par plusieurs équipes
- Une réutilisation du code entre Customer et Collaborator

### Libraries

Les **libraries** contiennent le code partagé :
- **common** : services, stores, outils utilisables par tout le monde dans le monorepo
- **shared** : ce qui est propre à l'applicatif client/collab
- **toolbox** : utilitaires fondamentaux, logs, feature flags
- **styleguide** : composants UI et Design System
- **widgets** : système de widgets configurables

## Le Back-Office

Le **Back-Office** (`@pulse/backoffice`) est une application interne réservée à l'équipe Pulse. 
Elle permet de gérer les **variables d'environnement** (app settings) des différents environnements : ITG, REC et PRD.

L'authentification se fait via **MSAL** en mode ADM-CLD. Cette application n'est pas destinée aux collaborateurs des cabinets, uniquement à l'équipe technique.

## Principes de développement

### Monorepo

Le **monorepo** centralise tout le code dans un seul repository Git, structuré en trois couches via npm workspaces : les apps (applications déployables comme Customer/Collaborator), les applets (modules métier comme GED, login) et les libraries (code partagé comme common, styleguide). Cette approche permet un partage de code simplifié entre packages via des imports @pulse/*, un refactoring global instantané et un versioning unifié sans publication npm intermédiaire.

### Design System

Le styleguide est basé sur **Element Plus** avec des personnalisations RYDGE. 

::: tip Attention
Privilégiez toujours les composants du styleguide avant d'en créer de nouveaux.
:::

### Feature Flags

Les nouvelles fonctionnalités sont souvent déployées derrière des **feature flags**. Cela permet un déploiement progressif et des tests en production contrôlés.

## Pour aller plus loin

- [Le concept de Monorepo](/monorepo/) - Comprendre notre architecture générale
- [Structure de la PLU](/plu/structure) - Détails de l'architecture applicative
- [Guidelines](/guidelines/) - Conventions et bonnes pratiques
