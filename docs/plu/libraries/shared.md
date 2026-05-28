# Shared

Le projet `@pulse/shared` est une bibliothèque Vue qui fournit les **composants et layouts partagés** de l'écosystème Pulse. Elle contient des éléments d'interface utilisateur réutilisables qui sont **agnostiques du métier** et peuvent être utilisés par l'application principale et tous les applets.

## Rôle et responsabilités

Cette bibliothèque constitue la **couche de présentation partagée** du monorepo :

- **Layouts système** : Squelettes de pages réutilisables (home, login, empty)
- **Composants de structure** : Sidebar avec gestion des entités et navigation
- **Gestionnaire de sidebar** : Manager pour contrôler l'affichage et le contenu de la sidebar
- **Composants partagés** : Éléments d'interface communs à plusieurs applets

## Architecture et dépendances

### Caractère agnostique
`@pulse/shared` se distingue par son **indépendance vis-à-vis de la logique métier** :
- **Pas de services métier** : N'implémente pas de logique liée aux mandats, offres, ou autres concepts métier spécifiques
- **Composants génériques** : Layouts et composants réutilisables dans différents contextes
- **Séparation des responsabilités** : Se concentre sur la structure et la présentation, délègue la logique métier à `@pulse/common`

### Dépendances
La bibliothèque s'appuie sur les autres packages du monorepo :
- **`@pulse/toolbox`** : Utilitaires TypeScript purs (helpers, logger, types)
- **`@pulse/common`** : Services métier et stores nécessaires aux composants (entités, permissions, utilisateur)
- **`@pulse/styleguide`** : Composants UI de base et système de design
- **Vue 3** : Framework de composants

## Fonctionnalités principales

### Layouts système

La bibliothèque expose trois layouts principaux :

#### Layout Home
Le layout principal de l'application avec :
- **Sidebar** : Navigation latérale avec sélection d'entité
- **Zone de contenu** : Emplacement pour le contenu des applets
- **Structure responsive** : Adaptation mobile/desktop

#### Layout Login
Layout épuré pour les pages d'authentification :
- **Design centré** : Focus sur le formulaire de connexion
- **Branding** : Logo et éléments visuels Pulse

#### Layout Empty
Layout minimal sans structure :
- **Flexibilité totale** : Pour les pages nécessitant un contrôle complet
- **Pas de navigation** : Utilisé pour les pages système (erreurs, maintenance)

### Sidebar et gestion des entités

#### Composant Sidebar
La sidebar fournit :
- **Sélection d'entité** : Liste et changement d'entité active
- **Navigation** : Liens vers les différentes sections
- **Avatar entité** : Affichage visuel de l'entité courante
- **Menu contextuel** : Actions disponibles pour l'entité

#### Sidebar Manager
Un gestionnaire expose une API pour :
- **Contrôler l'affichage** : Afficher/masquer la sidebar programmatiquement
- **Gérer le contenu** : Ajouter/retirer des items de navigation
- **Configuration** : Personnaliser le comportement selon l'applet

## Structure et exports modulaires

La bibliothèque expose ses fonctionnalités via des points d'entrée dédiés :

```typescript
import { LayoutHome, LayoutLogin, LayoutEmpty } from '@pulse/shared/layouts'
import { useSidebarManager } from '@pulse/shared/manager'
import { SharedComponent } from '@pulse/shared/components'
```

### Exports principaux
- **`/layouts`** : Les trois layouts système (Home, Login, Empty)
- **`/manager`** : Le gestionnaire de sidebar
- **`/components`** : Composants partagés génériques

## Intégration dans l'écosystème

### Utilisation dans l'application principale
L'app `@pulse/app` utilise `@pulse/shared` pour :
- **Structure globale** : Layout Home comme conteneur principal
- **Pages d'authentification** : Layout Login pour les écrans de connexion
- **Sidebar globale** : Navigation et sélection d'entité

### Utilisation dans les applets
Les applets peuvent :
- **Hériter des layouts** : Utiliser Layout Home pour bénéficier de la sidebar
- **Personnaliser la sidebar** : Ajouter des items de navigation via le manager
- **Utiliser les composants** : Réutiliser les composants partagés

### Différence avec d'autres bibliothèques

| Bibliothèque | Rôle | Dépendances Vue | Logique métier |
|--------------|------|-----------------|----------------|
| `@pulse/toolbox` | Utilitaires purs TypeScript | ❌ Non | ❌ Non |
| `@pulse/common` | Services métier et stores | ✅ Oui | ✅ Oui (cœur métier) |
| `@pulse/shared` | Layouts et composants UI | ✅ Oui | ❌ Non (agnostique) |
| `@pulse/styleguide` | Design system | ✅ Oui | ❌ Non (composants de base) |

## Développement

Comme il s'agit d'une bibliothèque, elle ne peut pas être exécutée indépendamment. Le développement se fait en mode monorepo avec hot-reload lors des modifications.

Les scripts de build, test et lint sont disponibles dans le `package.json` du package.
