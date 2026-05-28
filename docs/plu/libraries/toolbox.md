# Toolbox

La bibliothèque `@pulse/toolbox` est la **boîte à outils technique** du monorepo. Elle fournit les utilitaires TypeScript purs, le logger, et les outils de base partagés par tous les packages de l'écosystème Pulse.

## Rôle et responsabilités

### Fondations techniques pures
`@pulse/toolbox` constitue la **couche utilitaire de base** du monorepo, strictement **agnostique du métier** et **du framework** :
- **Utilitaires TypeScript purs** : Fonctions pour manipuler arrays, objects, dates, strings, HTTP
- **Logger centralisé** : Système de logging configurable pour toute l'application
- **Validateurs** : Fonctions de validation de données
- **Gestionnaires système** : Services de configuration technique (versions, build info)
- **Mocks de test** : Utilitaires pour faciliter les tests unitaires

### Architecture zero-dependency
Cette bibliothèque est **intentionnellement minimaliste** et se distingue de `@pulse/common` :
- **Aucune dépendance Vue** : Code TypeScript pur réutilisable partout (contrairement à `@pulse/common`)
- **Aucun service métier** : Pas de logique liée aux entités, permissions, ou autres concepts Pulse
- **API simple** : Fonctions pures et composables
- **Performance optimale** : Pas de surcharge framework
- **Testabilité maximale** : Isolation complète pour tests unitaires simples

## Structure et exports modulaires

### Organisation par responsabilité
La bibliothèque expose ses fonctionnalités via des **exports ciblés** permettant d'importer uniquement les fonctionnalités nécessaires :
- **Gestionnaires système** : Classes de gestion globales accessibles directement
- **Utilitaires spécialisés** : Fonctions utilitaires organisées par modules thématiques
- **Logger global** : Service de logging centralisé pour toute l'application

## Fonctionnalités clés

### Gestion des versions et build

Le gestionnaire de versions fournit automatiquement les informations de build :
- **Version du monorepo** : Numéro de version principal (ex: "1.0.0")
- **Identifiant de commit** : Hash court du commit Git (ex: "a1b2c3d")
- **Nom de branche** : Branche active du dépôt (ex: "main")

**Utilisations :**
- **Affichage version** : Interface utilisateur (sidebar, footer)
- **Debug et support** : Identification précise des builds
- **CI/CD** : Intégration dans les pipelines de déploiement

### Logger centralisé

Le système de logging configurable offre plusieurs niveaux de traçabilité :
- **Info** : Informations générales de fonctionnement
- **Warn** : Avertissements importants nécessitant attention
- **Error** : Erreurs critiques avec contexte d'erreur
- **Debug** : Informations détaillées pour le développement

**Caractéristiques :**
- **Niveaux dynamiques** : Configuration par environnement
- **Format standardisé** : Timestamps, niveaux, couleurs
- **Performance** : Désactivation automatique en production
- **Debugging** : Traçabilité complète en développement

## Intégration dans l'écosystème

### Utilisation transversale
`@pulse/toolbox` fournit des **utilitaires réutilisables** à travers le monorepo :

#### Dans `@pulse/common`
- **Utilitaires de base** : Manipulation de données, dates, strings
- **Logger** : Traçabilité des opérations métier
- **Validateurs** : Validation de données métier

#### Dans `@pulse/shared`
- **Utilitaires** : Helpers pour les composants
- **Types** : Définitions communes

#### Dans les applets
- **Logging** : Traçabilité des erreurs et actions
- **Validation** : Contrôles de saisie utilisateur
- **Utilitaires** : Manipulation de données

#### Dans l'application principale
- **Version management** : Affichage des informations de build
- **Configuration globale** : Paramétrage par environnement
- **Logger** : Système de logging centralisé

### Extensibilité
La bibliothèque est conçue pour **évoluer facilement** :
- **Nouveaux utilitaires** : Ajout simple via exports modulaires
- **Types métier** : Centralisation des définitions communes

## Scripts et développement

Le processus d'initialisation est géré à la racine du monorepo en utilisant la fonctionnalité `workspaces` de npm. 

Comme il s'agit d'une bibliothèque et non d'une application autonome, elle ne peut pas être exécutée indépendamment. Cependant, vous pouvez la builder et la tester.

### Scripts disponibles

Les principales commandes disponibles pour ce package incluent :
- **Build** : Compilation TypeScript optimisée avec génération des types
- **Tests** : Suite complète de tests unitaires
- **Lint** : Vérification qualité du code avec ESLint
- **Type checking** : Validation des types TypeScript

Ces scripts sont définis dans le `package.json` du package et peuvent être exécutés via npm depuis la racine du monorepo.