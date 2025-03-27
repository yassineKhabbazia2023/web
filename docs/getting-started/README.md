# Pour commencer

## Prérequis

Assurez-vous d'avoir la version correcte de Node.js (référez-vous au `package.json`).

Pour initier le processus, exécutez la commande suivante :

```bash
npm install
```

## Fichiers /public

Pour démarrer l'application sur votre ordinateur local, assurez-vous d'avoir deux fichiers, qui sont ignorés par git, configurés dans le dossier `./packages/app/public/` :

### env-vars.js

Les variables d'environnement sont essentielles pour le lancement de l'application, car elles spécifient - entre autres - les URL de l'API et les feature-flags. 

Le fichier ressemble à ceci :

```javascript title="./packages/app/public/env-vars.js"
const envVars = {
  VITE_ACCOUNTING_HUB_URL: `xxx`,
  VITE_AMPLITUDE_API_KEY: `yyy`,
  VITE_SCHEDULE_ACTIVATED: `false`,
}
window.EnvVars = envVars
```

Pour plus d'informations sur les env-vars, veuillez vous référer au fichier `CONFIG.md` à la racine du projet.

#### Récupération des env-vars pour le développement

Deux façon de récupérer le fichier _env-vars.js_ :

  1. Demander à un collègue de prêter le sien

  2. Récupérer le fichier sur [ITG](https://app-itg01.itg.pulse.rydge.fr/env-vars.js) et modifier les valeurs suivantes pour que ça fonctionne en local :  

```
`VITE_API_MSAL_POST_LOGOUT_REDIRECT_URI: "http://localhost:9000/collaborateur",`  
```
```
`VITE_API_MSAL_REDIRECT_URI: "http://localhost:9000/collaborateur",`  
```

Ces valeurs permettent au Front de se logger sur l'application en tant que collaborateur et de retourner sur le localhost. Sans ça, MSAL (l'outil de connexion SSO Collab) renverrait l'adresse d'ITG.

Copiez ensuite ce fichier dans `./packages/app/public/env-vars.js`.

### styles.css

Ce fichier est un simple wrapper pour les ressources de polices de caractères, permettant au navigateur de les mettre en cache.

Sans cela, l'application fonctionnera, mais la font ne sera pas la bonne.

Le fichier ressemble à ça :

```javascript title="./packages/app/public/styles.css"
@import url("https://assets-xxx.xxx/fonts/index.css");
```

Comme pour les `env-vars.js`, vous pouvez récupérer le fichier `styles.css` sur [ITG](https://app-itg01.itg.pulse.rydge.fr/styles.css) et le placer dans `./packages/app/public/styles.css`.

## Démarrer le Front en local

Une fois les `env-vars.js` et les `styles.css` installés, il vous suffit d'exécuter le script suivant pour lancer l'application Pulse sur votre machine locale :

```bash
npm run app:dev
```

Et ouvrir votre navigateur sur [http://localhost:9000](http://localhost:9000).

## Autres scripts

Pour plus d'informations et de scripts, référez-vous au `package.json` à la racine, ou consultez les fichiers `package.json` dans chaque application, applets et libraries.  
Ce monorepo utilise la fonctionnalité `workspaces` de npm (voir la [documentation officielle](https://docs.npmjs.com/cli/v10/using-npm/workspaces)).

@[code json:no-line-numbers title="./package.json"](@root/package.json)