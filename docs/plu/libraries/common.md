# Common

Le projet `@pulse/common` est **le cœur de l'application Pulse**. C'est une bibliothèque Vue/TypeScript qui contient les services métier essentiels, les stores d'état et les managers critiques sans lesquels l'application ne peut pas fonctionner.

## Rôle et responsabilités

Cette bibliothèque constitue **la fondation métier** de l'écosystème Pulse :

- **Services métier critiques** : Gestion des entités, permissions, utilisateur courant, booking, et autres services transversaux essentiels
- **Gestion d'état centralisée** : Stores Pinia pour l'état utilisateur, entités sélectionnées, permissions, tokens, et booking
- **Managers applicatifs** : Gestionnaires de login, routing, feature flags, entités sélectionnées, et reporting
- **Intégrations externes** : Services d'authentification (MSAL), Pennylane, Amplitude, et autres intégrations critiques
- **API client** : Client HTTP avec intercepteurs pour toutes les requêtes backend
- **Internationalisation** : Services de traduction i18n
- **Configuration métier** : Constants, énumérations et types liés au domaine métier

## Architecture et dépendances

### Caractère non-agnostique
Contrairement à `@pulse/toolbox` qui fournit des utilitaires purs, `@pulse/common` est **étroitement couplée au framework Vue** et au métier Pulse :
- Dépendances sur Vue 3 et Pinia pour la gestion d'état
- Dépendances sur `@pulse/toolbox` pour les utilitaires de base
- Services spécifiques au domaine métier (entités, mandats, permissions Pulse)

### Exports modulaires
La bibliothèque expose ses fonctionnalités via des **points d'entrée dédiés** :
- **Services métier** : `services/entities`, `services/permissions`, `services/booking`, `services/current-user`, etc.
- **Stores Pinia** : `stores` (user, entités, permissions, tokens, booking)
- **Managers** : `managers` (login, routes, feature-flags, current-entity, reporting)
- **Utilitaires** : `helpers`, `utils`, `composables`
- **Configuration** : `constants`, `enums`, `types`
- **Internationalisation** : `i18n`

Cette organisation modulaire permet aux consommateurs d'importer uniquement les fonctionnalités nécessaires tout en maintenant une architecture cohérente.

## Développement

Comme il s'agit d'une bibliothèque, elle ne peut pas être exécutée indépendamment. Le développement se fait en mode monorepo avec hot-reload lors des modifications.

Les scripts de build, test et lint sont disponibles dans le `package.json` du package.