# Imports dans le monorepo

## Convention de nommage

Dans ce monorepo, tous les packages internes utilisent le préfixe `@pulse/` au lieu de `@`. Cette convention permet de :

- Éviter les conflits avec les packages npm publics
- Identifier clairement les dépendances internes au projet
- Maintenir une cohérence dans l'organisation du code

## Structure des packages

Le monorepo est organisé en plusieurs catégories de packages :

### Libraries (`packages/libraries/`)

- `@pulse/common` - Utilitaires, services et composables partagés
- `@pulse/toolbox` - Fonctions utilitaires de base et types fondamentaux
- `@pulse/styleguide` - Composants UI et styles
- `@pulse/widgets` - Widgets réutilisables

### Applets (`packages/applets/`)

- `@pulse/entities` - Gestion des entités
- `@pulse/ged` - Gestion électronique de documents
- `@pulse/launcher` - Module de lancement
- `@pulse/login` - Authentification
- `@pulse/mandate` - Gestion des mandats
- `@pulse/offers-catalog` - Catalogue d'offres

## Système d'exports

Chaque package définit ses exports dans le `package.json` via la propriété `exports`. Cela permet d'importer des parties spécifiques du package :

```json
{
  "exports": {
    "./constants": "./src/constants.ts",
    "./managers": "./src/managers/index.ts",
    "./services/cgu": "./src/services/cgu/index.ts",
    "./types": "./src/types.ts"
  }
}
```

## Exemples d'imports

### Import de services spécifiques

```typescript
// ✅ Correct - Import spécifique depuis @pulse/common
import { CurrentUserManager } from '@pulse/common/managers'
import { amplitudeService } from '@pulse/common'
import { useUserStore } from '@pulse/common/stores'

// ✅ Correct - Import depuis @pulse/toolbox
import { loggerMock } from '@pulse/toolbox/mocks'
import { arrayUtils } from '@pulse/toolbox/utils/array'

// ✅ Correct - Import de composants UI
import { PButton } from '@pulse/styleguide/components'
```

### Import de constants et types

```typescript
// ✅ Correct - Import de constantes
import { CONSTANT } from '@pulse/common/constants'

// ✅ Correct - Import de types
import type { User } from '@pulse/common/types'
import type { ValidationRule } from '@pulse/toolbox/types'
```

### Import complet d'un package

```typescript
// ✅ Correct - Import du point d'entrée principal
import { amplitudeService } from '@pulse/common'
import { logger } from '@pulse/toolbox'
```

## Erreurs courantes à éviter

### ❌ Utilisation du mauvais préfixe

```typescript
// ❌ Incorrect - utilise @ au lieu de @pulse/
import { CurrentUserManager } from '@common/managers'
import { PButton } from '@styleguide/components'

// ✅ Correct
import { CurrentUserManager } from '@pulse/common/managers'
import { PButton } from '@pulse/styleguide/components'
```

### ❌ Import de chemins non-exportés

```typescript
// ❌ Incorrect - tente d'importer un chemin non déclaré dans exports
import { someUtil } from '@pulse/common/src/utils/private'
import { InternalComponent } from '@pulse/styleguide/src/internal'

// ✅ Correct - utilise les exports déclarés
import { someUtil } from '@pulse/common/helpers'
import { PublicComponent } from '@pulse/styleguide/components'
```

### ❌ Import circulaire entre packages

```typescript
// ❌ Incorrect - créerait une dépendance circulaire
// Dans @pulse/common
import { Widget } from '@pulse/widgets'

// Dans @pulse/widgets  
import { Service } from '@pulse/common'
```

## Vérification des dépendances

Avant d'utiliser un import, assurez-vous que :

1. **Le package est déclaré dans `package.json`** :
   ```json
   {
     "dependencies": {
       "@pulse/common": "1.0.0",
       "@pulse/toolbox": "1.0.0"
     }
   }
   ```

2. **Le chemin d'export existe** : Vérifiez la propriété `exports` du package source

3. **La version est compatible** : Les versions doivent correspondre entre les packages

## Résolution de problèmes

### Import non trouvé

Si vous obtenez une erreur "Module not found" :

1. Vérifiez que le package est dans les `dependencies` de votre `package.json`
2. Confirmez que l'export existe dans le `package.json` du package source
3. Rebuilds les types : `npm run build:types`

### Erreurs de types TypeScript

Si TypeScript ne reconnaît pas les types :

1. Vérifiez que le package source exporte ses types
2. Rebuilds le projet : `npm run build`
3. Redémarrez le serveur de langage TypeScript dans VS Code

## Bonnes pratiques

### Import granulaire

Préférez les imports spécifiques aux imports globaux :

```typescript
// ✅ Préféré - import granulaire
import { CurrentUserManager } from '@pulse/common/managers'
import { CONSTANT } from '@pulse/common/constants'

// ⚠️ Moins optimal - on préfère l'import granulaire à l'import global
import { CurrentUserManager, CONSTANT } from '@pulse/common'
```

### Groupement des imports

Organisez vos imports par source :

```typescript
// Packages externes
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Packages internes @pulse
import { CurrentUserManager } from '@pulse/common/managers'
import { useUserStore } from '@pulse/common/stores'
import { PButton, PCard } from '@pulse/styleguide/components'

// Imports relatifs locaux
import './MyComponent.styles.scss'
import type { MyComponentProps } from './MyComponent.types'
```
