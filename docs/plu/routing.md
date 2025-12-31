# Routing

Le projet utilise Vue Router avec une architecture modulaire. Les deux applications (Customer et Collaborator) ont des routeurs séparés mais suivent les mêmes patterns.

## Structure des fichiers

```
packages/apps/[customer|collaborator]/src/router/
├── customer.router.ts       # Configuration du routeur + guards
├── customer.routes.ts       # Constantes des routes (path/name)
├── routes/                  # Routes groupées par fonctionnalité
│   ├── anonymous.routes.ts
│   ├── authenticated.routes.ts
│   ├── entity.routes.ts
│   ├── wallet.routes.ts
│   └── error.routes.ts
├── guards/                  # Guards spécifiques à l'app
└── registry/                # Registres dynamiques (sidebar, wallet tabs)
```

## Organisation des routes

Les routes sont organisées en groupes logiques :

```
/ (Root)
├── Routes Anonymes (login, validation, reset password)
├── Routes Authentifiées
│   ├── Landing
│   ├── Entity (/dossier/:entityId)
│   │   ├── Homepage
│   │   ├── Overview (users, offers, info)
│   │   ├── Documents (GED, Pennylane)
│   │   └── PowerBI
│   ├── Wallet (vue portefeuille)
│   └── CGU
├── Routes Erreur (403, 500)
└── 404 (catch-all)
```

## Système de métadonnées

Chaque route peut définir des métadonnées pour contrôler son comportement :

| Metadata | Type | Description |
|----------|------|-------------|
| `ALLOW_ANONYMOUS_META` | boolean | Route accessible sans authentification |
| `ALLOW_AUTHENTICATED_META` | boolean | Route accessible avec authentification |
| `FEATURE_FLAG_META` | Feature | Feature flag requis |
| `PERMISSIONS_META` | Permission[] | Permissions requises |
| `HTML_TITLE_META` | string | Titre de la page (SEO) |
| `LAYOUT_META` | Layout | Layout à utiliser |
| `LAYOUT_NO_PADDING_META` | boolean | Supprime le padding du layout |

## Navigation Guards

Les guards s'exécutent dans cet ordre :

1. **authenticationGuard** - Vérifie l'authentification
2. **featureFlagGuard** - Vérifie les feature flags
3. **currentEntityGuard** - Charge l'entité courante
4. **permissionGuard** - Vérifie les permissions
5. **seoGuard** (afterEach) - Met à jour le titre

### Guards partagés

Les guards réutilisables sont dans `@pulse/shared/guards` :
- `featureFlagGuard`
- `currentEntityGuard`
- `seoGuard`

### Guards spécifiques

Chaque app a ses propres guards d'authentification et permissions :
- `customerAuthenticationGuard` / `collaboratorAuthenticationGuard`
- `customerPermissionGuard` / `collaboratorPermissionGuard`

## Constantes de routes

Les routes sont définies comme constantes pour garantir la cohérence :

```typescript
// customer.routes.ts
export const CUSTOMER_ROUTES = {
  root: { path: '/', name: 'ROOT' },
  entity: {
    root: { path: '/dossier/:entityId', name: 'ENTITY' },
    homepage: { path: 'homepage', name: 'ENTITY_HOMEPAGE' },
  },
  wallet: { path: '/wallet', name: 'WALLET' },
  // ...
}
```

## Lazy Loading

Les composants sont chargés dynamiquement pour optimiser les performances :

```typescript
component: () => import('@pulse/ged').then(m => m.GedPage)
```

## Helpers

La classe `RouterHelpers` (`@pulse/common`) fournit des utilitaires :
- `hasProvidedAncestor()` - Vérifie les routes parentes
- `isRouteOrAncestorActive()` - État actif
- `getRouteParamAsInt()` - Parse les paramètres
