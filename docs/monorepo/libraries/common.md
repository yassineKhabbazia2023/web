# Common

Le projet `@pulse/common` est une bibliothèque TypeScript avec des éléments Vue qui centralise les fonctionnalités partagées de l'écosystème Pulse. Elle sert de fondation commune pour l'application principale et tous les applets.

## Rôle et responsabilités

Cette bibliothèque fournit une couche d'abstraction pour :

- **Services métier** : Gestion des entités, permissions, utilisateur courant et autres services transversaux
- **Utilitaires et helpers** : Fonctions d'aide réutilisables pour le développement
- **Gestion d'état** : Stores et gestionnaires d'état partagés
- **Internationalisation** : Services de traduction et localisation
- **Configuration** : Constants, énumérations et types communs
- **Intégrations** : Services d'authentification, API et autres intégrations externes

## Architecture

La bibliothèque est structurée en modules exportables indépendants, permettant aux consommateurs d'importer uniquement les fonctionnalités nécessaires. Chaque module expose ses fonctionnalités via des points d'entrée dédiés, facilitant la maintenance et optimisant les bundles.

## Développement

Comme il s'agit d'une bibliothèque, elle ne peut pas être exécutée indépendamment. Le développement se fait en mode monorepo avec hot-reload lors des modifications.

Les scripts de build, test et lint sont disponibles dans le `package.json` du package.