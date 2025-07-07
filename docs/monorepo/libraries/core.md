# Core

La bibliothèque `@pulse/core` est le **socle technique fondamental** du monorepo. Elle fournit les utilitaires TypeScript essentiels, les gestionnaires système et les outils de base partagés par tous les packages de l'écosystème Pulse.

## Rôle et responsabilités

### Fondations techniques
`@pulse/core` constitue la **couche de base** du monorepo :
- **Utilitaires purs** : Fonctions TypeScript sans dépendances Vue
- **Gestionnaires système** : Services de configuration et de contrôle applicatif
- **Types et constantes** : Définitions partagées pour la cohérence globale
- **Outils de développement** : Helpers pour les tests et le debugging

### Architecture zero-dependency
Cette bibliothèque est **intentionnellement légère** :
- **Aucune dépendance Vue** : Code TypeScript pur réutilisable partout
- **API minimaliste** : Fonctions simples et composables
- **Performance optimale** : Pas de surcharge framework
- **Testabilité maximale** : Isolation complète des logiques métier

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

### Système de Feature Flags

Le gestionnaire de feature flags permet le contrôle conditionnel de fonctionnalités.

**Avantages :**
- **Déploiement progressif** : Activation graduelle des nouvelles fonctionnalités
- **A/B Testing** : Tests utilisateur contrôlés (plus tard)
- **Rollback rapide** : Désactivation instantanée sans redéploiement
- **Environnements multiples** : Configuration par environnement

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
`@pulse/core` est utilisé par **tous les packages**, par exemple :

#### Dans les applets
- **Feature flags** : Activation conditionnelle des fonctionnalités
- **Logging** : Traçabilité des erreurs et actions
- **Validation** : Contrôles de saisie utilisateur

#### Dans l'application principale
- **Version management** : Affichage des informations de build
- **Configuration globale** : Paramétrage par environnement
- **Guards de navigation** : Contrôle d'accès par feature flags

#### Dans les autres bibliothèques
- **Utilitaires de base** : Fonctions pures réutilisables
- **Types partagés** : Cohérence des interfaces
- **Mocks de test** : Facilitation des tests unitaires

### Extensibilité
La bibliothèque est conçue pour **évoluer facilement** :
- **Nouveaux utilitaires** : Ajout simple via exports modulaires
- **Feature flags additionnels** : Extension du FeatureFlagManager
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