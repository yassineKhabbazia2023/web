# Introduction 

Le projet `@pulse/styleguide` est une bibliothèque de composants Vue. Il définit le Design System de Pulse.

# Pour Commencer

Le processus d'initialisation est géré à la racine du monorepo en utilisant la fonctionnalité `workspaces` de npm. Veuillez vous référer au [README racine](../../../README.md) pour les instructions sur l'installation de toutes les dépendances.

# Histoire

Vous pouvez voir les composants en action dans [Histoire](https://histoire.dev/).
Histoire est une bibliothèque qui permet de visualiser et de documenter les composants Vue dans un environnement interactif que vous pouvez builder de la sorte :

```
npm run story:dev
```

Ouvrez ensuite votre navigateur sur http://localhost:6006 pour naviguer dans le Design System.


# Ajouter des images ou des icônes

Après avoir ajouté des images (dans `packages\libraries\styleguide\src\assets\images-origin`) ou des icônes (dans `packages\libraries\styleguide\src\assets\icons`), vous devez les générer avec le script suivant :

```
npm run generate
```

# Autres scripts

Référez-vous au [package.json](./package.json) pour les scripts que vous pouvez exécuter sur ce package.