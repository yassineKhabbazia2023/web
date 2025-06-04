# Documentation

La présente documentation est propulsée par [VitePress](https://vitepress.dev/).

## Rédiger une page de documentation

Pour écrire de la doc, soit on trouve la page qu'on a envie d'éditer et on l'édite directement. 
Soit on créé une nouvelle page auquel cas il faut l'ajouter dans le fichier `docs/.vitepress/config.mts`.

On a deux endroits possibles :

1. **La nav (le header de la page)**

```ts
nav: [
  {
    text: 'Mon-titre-affiché',
    link: '/lien-vers-ma-page/',
    // si c'est le nom d'un .md il sera compris (on n'ajoute pas le .md)
    // si c'est le nom d'un dossier il prendra le index.md
  },
  ...
]
```

2. **La sidebar (le menu de gauche)**

```ts
 sidebar: {
  '/lien-vers-mon-dossier/': [
    {
      text: 'Mon-titre-affiché',
      link: '/lien-vers-ma-page/', // nécessaire si on veut rendre le titre cliquable 
      items: [
        {
          text: 'Sous-titre-affiché',
          link: '/lien-vers-mon-dossier/nom-de-ma-page',
        }
        // si on ne met pas d'items enfants, la sidebar affichera les titres markdown de la page à la place
        // (ceux qui commence par #)
      ],
    },
  ],
  ...
]
```

## Markdown

VuePress gère le [Markdown](https://commonmark.org/help/) classique mais le thème que l'on a choisi permet des [trucs rigolos](https://vitepress.dev/guide/markdown#markdown-extensions).

#### Exemple de widgets markdown

```markdown
::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a dangerous warning
:::

::: info
This is an information.
:::

::: details
This is a details block
:::
```

::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a dangerous warning
:::

::: info
This is an information.
:::

::: details
This is a details block
:::
