# Variables d'environnement

Les variables d'environnement sont obtenues par un script généré pendant le pipeline appelé "Shell", qui crée un fichier `env-vars.js` publié à côté de l'`index.html` du site web.

Dans le code de l'application, les variables d'environnement sont récupérées via une extension de Vite (`viteExternalsPlugin`), qui permet de transformer un import en constante comme suit :

`import { VITE_XXX_YYY_ZZZ } from 'env-vars'`

devient

`const VITE_XXX_YYY_ZZZ = window.envVars.VITE_XXX_YYY_ZZZ`

## Exemple de fichier env-vars.js

```
const envVars = {
  VITE_XXX_YYY_ZZZ : 'foo',
  VITE_AAA_BBB_CCC : 'bar',
}
window.EnvVars = envVars
```


## Liste des env-vars et leur effet

[//]: # (SCRAP BELOW)
| variables d'environnement Front | description |
|---|---|
| VITE_ACCOUNTING_HUB_URL | URL de Connexion au hub signalR pour la synchronisation PIA sur la GED  |
| VITE_AMPLITUDE_ACTIVATED | Feature-flag pour Amplitude |
| VITE_AMPLITUDE_API_KEY | Clé d'API Amplitude (outil de tracking) |
| VITE_AMPLITUDE_SERVER_URL | URL de proxy Amplitude |
| VITE_API_DS | Alias API Gateway pour la GED |
| VITE_API_GATEWAY | URL de l'API Gateway |
| VITE_API_MSAL_AUTHORITY | URL de l'autorité d’authentification utilisateur (Collab) |
| VITE_API_MSAL_CLIENT_ID | Identifiant client pour l'autorité d’authentification (Collab) |
| VITE_API_MSAL_POST_LOGOUT_REDIRECT_URI | Route de redirection après le logout (Collab) |
| VITE_API_MSAL_REDIRECT_URI | Route de redirection après l'authentification (Collab) |
| VITE_API_MSAL_SCOPE | Configuration de l'autorité d’authentification utilisateur (Collab) |
| VITE_API_MSAL_TENANT | Configuration de l'autorité d’authentification utilisateur (Collab) |
| VITE_ASSETS_BASE_URL | URL des assets Front (images, fonts) |
| VITE_CONFIG_OFFERS_BOOK | URL d'un site web à partager aux utilisateurs |
| VITE_FEED_CENTER_ACTIVATED | Feature-flag du Feed Center |
| VITE_GIGYA_SSO_ACTIVATED | Feature-flag du GIGYA SSO |
| VITE_GESTION_MEG | URL de connexion SSO MEG |
| VITE_HOMEPAGE_WIDGETS_ACTIVATED | Feature flag de la home widgétisée |
| VITE_IDLE_DURATION | Temps de non-utilisation de l'app avant une proposition de déconnexion automatique |
| VITE_MAIL_TO_GED_ACTIVATED | Feature flag de la fonctionnalité Mail2GED |
| VITE_MANDATE_REDIRECTION_TOOL_ACTIVATED | Feature flag de la fonctionnalité Mandate Redirection Tool
| VITE_PENNYLANE_SSO_URL | URL de connexion SSO Pennylane |
| VITE_PENNYLANE_COLLAB_SSO_URL | URL de connexion SSO Pennylane pour les collaborateurs |
| VITE_AXEPTIO_KEY | Clé d'API Axeptio (gestion des cookies) |
| VITE_GIGYA_KEY | Clé d'API Gigya (SSO) | 
| VITE_PRODUCT_FRUITS_ANONYMOUS_KEY | Clé du workspace ProductFruit Collab anonyme (login collab) |
| VITE_PRODUCT_FRUITS_ANONYMOUS_KEY_CLIENT | Clé du workspace ProductFruit Client anonyme (login client et maintenance) |
| VITE_PRODUCT_FRUITS_KEY | Clé du workspace ProductFruit Collab connecté |
| VITE_PRODUCT_FRUITS_KEY_CLIENT | Clé du workspace ProductFruit Client connecté |
| VITE_PASSWORD_RESET_MAX_ATTEMPTS | Nombre maximal de tentatives de réinitialisation du mot de passe |
