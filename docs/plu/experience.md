# Experience & Layouts

Le système de layouts gère la structure visuelle des pages.   
Une experience est un composant wrapper propre à chaque application (Customer, Collaborator) qui encapsule un layout en y ajoutant la configuration et les widgets spécifiques à cette app. L'App.vue sélectionne dynamiquement l'experience appropriée (HomeExperience, LoginExperience, etc.) en fonction de la métadonnée LAYOUT_META définie dans la route courante.

## Les 4 layouts

| Layout | Enum | Usage |
|--------|------|-------|
| **Home** | `Layout.MAIN` | Pages authentifiées - header, sidebar, contenu |
| **Login** | `Layout.LOGIN` | Pages de connexion - carte centrée avec branding |
| **Error** | `Layout.ERROR` | Pages d'erreur (404, 403, 500) |
| **Empty** | `Layout.EMPTY` | Fallback - simple router-view |

## Comment ça fonctionne

### 1. Définition dans la route

```typescript
{
  path: '/dossier/:entityId',
  meta: {
    [LAYOUT_META]: Layout.MAIN,
  }
}
```

### 2. Sélection dans App.vue

L'application lit la métadonnée et affiche le composant "experience" correspondant :

```typescript
const currentLayout = computed(() =>
  route.meta[LAYOUT_META] || Layout.EMPTY
)

const currentExperience = computed(() => {
  switch (currentLayout.value) {
    case Layout.MAIN:  return HomeExperience
    case Layout.LOGIN: return LoginExperience
    case Layout.ERROR: return ErrorExperience
    default:           return EmptyExperience
  }
})
```

## Home Layout (MAIN)

Le layout principal pour les utilisateurs authentifiés.

### Structure

```
┌─────────────────────────────────────────────┐
│  Header (56px)                    [Avatar]  │
├──────────┬──────────────────────────────────┤
│          │                                  │
│ Sidebar  │         Main Content             │
│          │         (router-view)            │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

### Composants

- **Header** : Logo, actions personnalisables, avatar utilisateur
- **Sidebar** : Sélecteur d'entité, menu de navigation, favoris
- **UserProfile** : Drawer pour les paramètres utilisateur
- **Main Container** : Contenu de la page (slot router-view)

### Props

```typescript
interface HomeLayoutProps {
  currentEntity?: Entity
  favoriteEntities: Entity[]
  userConfig?: {
    isCollab: boolean
    isCustomer: boolean
    isSingleEntity: boolean
  }
  isVisible: boolean
}
```

### Personnalisation du header

Les apps peuvent ajouter des widgets dans le header via un slot :

```vue
<HomeLayout>
  <template #header-actions>
    <FeedCenterHeaderWidget />
    <BookingHeaderWidget />
  </template>
</HomeLayout>
```

### Suppression du padding

Pour les pages nécessitant du contenu pleine largeur :

```typescript
meta: {
  [LAYOUT_META]: Layout.MAIN,
  [LAYOUT_NO_PADDING_META]: true,  // Supprime le padding 24px
}
```

## Login Layout

Layout dédié aux pages de connexion.

### Caractéristiques

- Carte centrée dans le viewport
- Fond sombre (`--p-black-rock-900`)
- Image responsive (masquée sur mobile)
- Branding différent selon l'app (Customer vs Collaborator)
- Gestion de la modal "session expirée"
- Footer avec liens légaux

## Error Layout

Layout minimaliste pour les pages d'erreur.

```vue
<template>
  <div class="error-container">
    <router-view />
  </div>
</template>
```

## Fichiers clés

| Fichier | Description |
|---------|-------------|
| `@pulse/common/enums/layouts.enums.ts` | Enum Layout |
| `@pulse/common/constants/route.meta.ts` | Constantes LAYOUT_META |
| `@pulse/shared/layouts/` | Composants de layout |
| `apps/[app]/src/experiences/` | Wrappers d'experience par app |
