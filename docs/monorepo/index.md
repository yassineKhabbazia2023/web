# Le concept de Monorepo

## Qu'est-ce qu'un monorepo ?

Un **monorepo** (monolithic repository) est une stratégie de gestion de code où plusieurs projets sont stockés dans un seul repository Git. Contrairement à l'approche "polyrepo" où chaque package a son propre repository, le monorepo centralise tout le code dans un seul endroit.

## Pourquoi un monorepo ?

### Avantages

- **Partage de code simplifié** : Les libraries communes sont directement accessibles sans publication npm
- **Refactoring global** : Renommer une fonction ou un type se propage instantanément partout
- **Versioning unifié** : Toutes les dépendances internes sont toujours synchronisées
- **CI/CD centralisée** : Un seul pipeline pour tout le projet
- **Visibilité complète** : Chaque développeur voit l'ensemble du code

### Inconvénients à connaître

- **Clone initial plus long** : Le repository contient tout le code
- **Build potentiellement plus long** : Nécessite des optimisations (caching, builds incrémentaux)
- **Permissions globales** : Tout le monde a accès à tout le code

## Notre implémentation

Pulse.Web utilise **npm workspaces** pour gérer le monorepo. Chaque package est déclaré dans le `package.json` racine :

```json
{
  "workspaces": [
    "packages/apps/*",
    "packages/applets/*",
    "packages/libraries/*"
  ]
}
```

### Structure des packages

```
packages/
├── apps/           # Applications déployables
│   ├── customer/
│   ├── collaborator/
│   └── backoffice/
├── applets/        # Fonctionnalités métier
│   ├── ged/
│   ├── login/
│   └── ...
└── libraries/      # Code partagé
    ├── common/
    ├── shared/
    ├── toolbox/
    └── styleguide/
```

### Dépendances internes

Les packages se référencent entre eux via leur nom npm :

```json
// packages/apps/customer/package.json
{
  "dependencies": {
    "@pulse/common": "1.0.0",
    "@pulse/styleguide": "3.1.0",
    "@pulse/ged": "1.0.0"
  }
}
```

npm workspaces résout automatiquement ces dépendances vers les packages locaux.

## Commandes utiles

```bash
# Installer toutes les dépendances (à la racine)
npm install

# Exécuter un script dans un workspace spécifique
npm run dev --workspace=@pulse/customer

# Exécuter un script dans tous les workspaces
npm run build --workspaces

# Lister tous les workspaces
npm query .workspace
```

## Bonnes pratiques

1. **Toujours travailler à la racine** : Lancer `npm install` depuis la racine du projet
2. **Respecter les frontières** : Les apps importent les libraries, pas l'inverse
3. **Utiliser les alias** : Importer via `@pulse/common` et non des chemins relatifs
4. **Vérifier les dépendances** : `npm run syncpack:list` pour détecter les incohérences
