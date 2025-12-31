# Back-Office

Le **Back-Office** (`@pulse/backoffice`) est une application interne réservée à l'équipe Pulse.

## Objectif

L'application permet de gérer les **variables d'environnement** (app settings) des différents environnements :
- **ITG** : Intégration
- **REC** : Recette
- **PRD** : Production

## Accès

L'authentification se fait via **MSAL** en mode ADM-CLD. Cette application n'est pas destinée aux collaborateurs des cabinets, uniquement à l'équipe technique Pulse.

## Fonctionnalités

- Rechercher et filtrer les variables par domaine et environnement
- Ajouter, modifier ou supprimer des variables
- Vue consolidée des variables sur tous les environnements

## Lancer en local

```bash
# Développement (http://localhost:9001)
npm run dev --workspace=@pulse/backoffice
```

::: warning Configuration requise
Copiez le fichier `.env-vars.example.js` vers `public/env-vars.js` et configurez vos valeurs Azure AD.
:::

## Structure

```
packages/apps/backoffice/
├── src/
│   ├── api/                   # Axios + interceptors
│   ├── pages/
│   │   ├── login.page.vue     # Page de connexion
│   │   └── app-settings/      # Gestion des variables
│   ├── routing/               # Router + guards
│   └── services/              # MSAL, app settings
└── public/
    └── env-vars.js            # Variables runtime (non commité)
```
