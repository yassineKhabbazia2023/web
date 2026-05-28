# Styleguide 

Le projet `@pulse/styleguide` est une bibliothèque de composants Vue. Il définit le Design System de Pulse.

Le processus d'initialisation est géré à la racine du monorepo en utilisant la fonctionnalité `workspaces` de npm. 

## Ajouter des images ou des icônes

Après avoir ajouté des images (dans `packages\libraries\styleguide\src\assets\images-origin`) ou des icônes (dans `packages\libraries\styleguide\src\assets\icons`), vous devez les générer avec le script suivant :

```bash
npm run generate
```

## Autres scripts

Référez-vous au `package.json` pour les scripts que vous pouvez exécuter sur ce package.

packages/libraries/styleguide/package.json