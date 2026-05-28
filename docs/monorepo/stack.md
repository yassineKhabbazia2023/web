# Stack technique

Cette page présente les principales technologies utilisées dans le monorepo Pulse.Web.

## Framework & Core

| Technologie | Version | Description |
|-------------|---------|-------------|
| [Vue 3](https://vuejs.org/) | 3.x | Framework JavaScript progressif avec Composition API |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Typage statique pour JavaScript |
| [Vite](https://vite.dev/) | 7.x | Build tool et serveur de développement |

## State Management & Routing

| Technologie | Version | Description |
|-------------|---------|-------------|
| [Pinia](https://pinia.vuejs.org/) | 2.x | Store officiel pour Vue 3 |
| [Vue Router](https://router.vuejs.org/) | 4.x | Routeur officiel pour Vue.js |
| [Vue I18n](https://vue-i18n.intlify.dev/) | 11.x | Internationalisation pour Vue |

## UI & Design System

| Technologie | Version | Description |
|-------------|---------|-------------|
| [Element Plus](https://element-plus.org/) | 2.x | Bibliothèque de composants UI pour Vue 3 |
| [Sass](https://sass-lang.com/) | 1.x | Préprocesseur CSS |
| [VueUse](https://vueuse.org/) | 14.x | Collection de composables Vue essentiels |

## Communication & API

| Technologie | Version | Description |
|-------------|---------|-------------|
| [Axios](https://axios-http.com/) | 1.x | Client HTTP |
| [SignalR](https://learn.microsoft.com/aspnet/signalr) | 8.x | Communication temps réel (WebSockets) |

## Testing

| Technologie | Version | Description |
|-------------|---------|-------------|
| [Vitest](https://vitest.dev/) | 4.x | Framework de tests unitaires natif Vite |
| [Vue Test Utils](https://test-utils.vuejs.org/) | 2.x | Utilitaires de test officiels pour Vue |
| [Playwright](https://playwright.dev/) | 1.x | Tests E2E cross-browser |
| [MSW](https://mswjs.io/) | 2.x | Mock Service Worker pour simuler les API |

## Documentation & Design

| Technologie | Version | Description |
|-------------|---------|-------------|
| [Storybook](https://storybook.js.org/) | 10.x | Développement et documentation de composants UI |
| [VitePress](https://vitepress.dev/) | 2.x | Générateur de documentation statique |

## Qualité de code

| Technologie | Version | Description |
|-------------|---------|-------------|
| [ESLint](https://eslint.org/) | 9.x | Linter JavaScript/TypeScript |
| [vue-tsc](https://github.com/vuejs/language-tools) | 2.x | Vérification de types pour les SFC Vue |

## Utilitaires

| Technologie | Version | Description |
|-------------|---------|-------------|
| [Day.js](https://day.js.org/) | 1.x | Manipulation de dates |
| [Lodash-es](https://lodash.com/) | 4.x | Utilitaires JavaScript |
| [jwt-decode](https://github.com/auth0/jwt-decode) | 4.x | Décodage de tokens JWT |

## Authentification & Analytics

| Technologie | Version | Description |
|-------------|---------|-------------|
| [MSAL Browser](https://github.com/AzureAD/microsoft-authentication-library-for-js) | 4.x | Authentification Microsoft (SSO Collaborateur) |
| [Amplitude](https://amplitude.com/) | 2.x | Analytics et tracking utilisateur |
| [Product Fruits](https://productfruits.com/) | 1.x | Onboarding et guides in-app |

## Commandes associées

```bash
# Lancer les tests unitaires
npm run test

# Lancer Storybook
npm run storybook

# Lancer la documentation VitePress
npm run docs:dev

# Lancer les tests E2E
npm run e2e
```
