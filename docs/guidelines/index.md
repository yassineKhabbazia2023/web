# Export des modules

Dans vos dossiers de code, vous pouvez regrouper et ré-exporter plusieurs modules via un fichier `index.ts` pour simplifier les imports ailleurs dans votre projet.

## Exemple : Export des constantes RegEx

*Pull request de référence* :  
https://dev.azure.com/FR-TPEME/Pulse/_git/Pulse.Web/pullrequest/5609

### 1. Création du fichier `index.ts`

Au sein du dossier `src/utils/validators`, créez un fichier `index.ts` et indiquez-y les entités (fonctions, classes, constantes…) que vous souhaitez exposer :

```ts
// src/utils/validators/index.ts

export * from './validators.utils';
export * from './validators.utils.const';
```
> **Astuce** : si vous voulez éviter de modifier manuellement l’`index.ts` à chaque ajout de nouvelles   fonctions, vous pouvez regrouper vos exports avec un `export *`, par exemple :
> ```ts
> // src/utils/index.ts
> export * from './validators.utils';
> export * from './formatters.utils';
> // ajoutez ici autant de fichiers que nécessaire, sans toucher au reste
> ```
> Cela vous permet d’ajouter ou de supprimer des utilitaires sans avoir à maintenir la liste des exports un par un.
---

### 2. Configuration de l’alias dans `package.json`

Pour pouvoir importer ces utilitaires via un chemin court (alias), utilisez le champ `exports` de votre `package.json` racine :

```jsonc
{
  "name": "core",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "exports": {
    // alias pour les validateurs
    "./utils/validator": "./src/utils/validators/index.ts",
  }
}
```

L’import se fait alors ainsi :

```ts
import { validateEmail } from 'core/utils/validator';
```
---