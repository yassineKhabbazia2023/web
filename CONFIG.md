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
| VITE_AXEPTIO_KEY | Clé d'API Axeptio (gestion des cookies) |
| VITE_CLARITY_OFFER_ACTIVATED | Feature flag de la fonctionnalité Clarity Offer |
| VITE_CONFIG_OFFERS_BOOK | URL d'un site web à partager aux utilisateurs |
| VITE_CONFIGCAT_SDK_KEY | Clé SDK ConfigCat pour les feature flags distants via OpenFeature |
| VITE_CUSTOMER_BOOKING_ACTIVATED | Si booking est activé pour les clients. |
| VITE_GESTION_MEG | URL de connexion SSO MEG |
| VITE_GIGYA_KEY | Clé d'API Gigya (SSO) | 
| VITE_GIGYA_SSO_ACTIVATED | Feature-flag du GIGYA SSO |
| VITE_MODSCREEN_V2_ACTIVATED | Affichage de la nouvelle version de la page de demandes MOD |
| VITE_PASSWORD_RESET_MAX_ATTEMPTS | Nombre maximal de tentatives de réinitialisation du mot de passe |
| VITE_PENNYLANE_AMENDMENT_FLOW_ACTIVATED | Feature-flag du flow de validation d'accès Pennylane (avenant) |
| VITE_PENNYLANE_ATTACHMENT_HELP_URL | URL de l'article d'aide pour le rattachement d'un dossier client externe Pennylane |
| VITE_PENNYLANE_COLLAB_SSO_URL | URL de connexion SSO Pennylane pour les collaborateurs |
| VITE_PENNYLANE_PRICING_TABLE_URL | URL de l'image de la grille tarifaire Pennylane affichée lors de l'activation d'offre |
| VITE_PENNYLANE_SSO_URL | URL de connexion SSO Pennylane |
| VITE_PRODUCT_FRUITS_ANONYMOUS_KEY | Clé du workspace ProductFruit Collab anonyme (login collab) |
| VITE_PRODUCT_FRUITS_ANONYMOUS_KEY_CLIENT | Clé du workspace ProductFruit Client anonyme (login client et maintenance) |
| VITE_PRODUCT_FRUITS_KEY | Clé du workspace ProductFruit Collab connecté |
| VITE_PRODUCT_FRUITS_KEY_CLIENT | Clé du workspace ProductFruit Client connecté |
| VITE_SMART_OFFER_DIFFERENT_RATE_ACCOUNTS | Liste des dossiers ayant un tarif différent pour l'offre Smart (usage temporaire). |
| VITE_SMART_OFFER_DIFFERENT_RATE_PRICE | Prix de l'offre Smart pour les dossiers ayant un tarif différent(usage temporaire). |
| VITE_TOKEN_EXPIRATION_BUFFER | Temps en minutes pour refresh le token avant son expiration |

## Feature Flags ConfigCat

Les feature flags ConfigCat sont gérés via OpenFeature et récupérés dynamiquement depuis ConfigCat. Ils ne nécessitent pas de redéploiement pour être modifiés.

**Configuration**: Les feature flags ConfigCat sont listés dans `OPEN_FEATURE_FLAGS` dans `packages/libraries/common/src/managers/feature-flag/feature-flag.manager.ts`

| Feature Flag ConfigCat | Description |
|---|---|
| isDelegationRequestTabsEnabled | Active les nouveaux onglets "Demande(s) en attente" et "Demander délégation" dans le drawer de délégation du portefeuille |
| isManageWalletMenuEnabled | Affichage du bouton « Gérer mon portefeuille » (menu déroulant) en remplacement des boutons délégations / création de compte de test du portefeuille |
| isProspectExperienceEnabled | Active l'expérience Prospect |
| isWalletV2Enabled | Active la version V2 du portefeuille (barre sticky des dossiers sélectionnés) |
