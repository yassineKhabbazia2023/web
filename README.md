# Introduction

Bienvenue dans le dépôt front-end de Pulse.
Ce dépôt est structuré comme un monorepo, englobant plusieurs composants :

- **[App](./packages/app/README.md)**
- **libraries**:
    - [Common](./packages/libraries/common/README.md)
    - [Core](./packages/libraries/core/README.md)
    - [StyleGuide](./packages/libraries/styleguide/README.md)
- **applets**:
    - [Entities](./packages/applets/entities/README.md)
    - [Ged](./packages/applets/ged/README.md)
    - [Launcher](./packages/applets/launcher/README.md)
    - [Login](./packages/applets/login/README.md)
    - [Mandate](./packages/applets/mandate/README.md)

L'application est une application Vue 3, intégrant les applets en tant que [Plugins Vue](https://vuejs.org/guide/reusability/plugins) directement depuis le monorepo.

# Pour commencer

## Prérequis

1. Assurez-vous d'avoir la version correcte de Node.js (référez-vous au [package.json](./package.json)).

Pour initier le processus, exécutez la commande suivante :

```
npm install
```

## Étapes importantes

### fichiers /public

Pour démarrer l'application sur votre ordinateur local, assurez-vous d'avoir deux fichiers, qui sont ignorés par git, configurés dans le dossier `./packages/app/public/` :

#### env-vars.js

Les variables d'environnement sont essentielles pour le lancement de l'application, car elles spécifient - entre autres - les URL de l'API et les feature-flags. 

Le fichier ressemble à ceci :

```
const envVars = {
  VITE_ACCOUNTING_HUB_URL: xxx`,
  VITE_AMPLITUDE_API_KEY: `yyy`,
  VITE_SCHEDULE_ACTIVATED: `false`,
}
window.EnvVars = envVars
```

Pour plus d'informations sur les env-vars, veuillez vous référer au fichier [CONFIG.md](./CONFIG.md).

##### Récupération des env-vars pour le développement

Deux façon de récupérer le fichier _env-vars.js_ :

1. Demander à un collègue de prêter le sien
2. Récupérer le fichier sur [ITG](https://app-itg01.itg.pulse.rydge.fr/env-vars.js) et modifier les valeurs suivantes pour que ça marche en local :
a. `VITE_API_MSAL_POST_LOGOUT_REDIRECT_URI: "http://localhost:9000/collaborateur",`
b. `VITE_API_MSAL_REDIRECT_URI: "http://localhost:9000/collaborateur",`
Ces valeurs permettent au Front de se logger sur l'application en tant que collaborateur et de retourner sur le localhost. Sans ça, MSAL (l'outil de connexion SSO Collab) renverrait l'adresse d'ITG.

Copiez ensuite ce fichier dans `./packages/app/public/env-vars.js`.

#### styles.css

Ce fichier est un simple wrapper pour les ressources de polices de caractères, permettant au navigateur de les mettre en cache.

Sans cela, l'application fonctionnera, mais la font ne sera pas la bonne.

Le fichier ressemble à ça :

```
@import url("https://assets-xxx.xxx/fonts/index.css");
```

Comme pour les `env-vars.js`, vous pouvez récupérer le fichier `styles.css` sur [ITG](https://app-itg01.itg.pulse.rydge.fr/styles.css) et le placer dans `./packages/app/public/styles.css`.

### Démarrer le Front en local

Une fois les `env-vars.js` et les `styles.css` installés, il vous suffit d'exécuter le script suivant pour lancer l'application Pulse sur votre machine locale :

```
npm run app:dev
```

Et ouvrir votre navigateur sur `http://localhost:9000`.

### Autres scripts

Pour plus d'informations et de scripts, référez-vous au [package.json](./package.json) à la racine, ou consultez les fichiers `package.json` dans chaque application, applets et libraries. Ce monorepo utilise la fonctionnalité `workspaces` de npm (voir la [documentation officielle](https://docs.npmjs.com/cli/v10/using-npm/workspaces)).