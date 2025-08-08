# Bad Code / Good Code selon les revues de pull requests

## Tester l’égalité

### ❌ Mauvais code

```ts
// coercition implicite, moins lisible
if (!flag) {
  // ...
}

if (flag) {
  // ...
}
```

### ✅ Bon code

```ts
// explicite et sans conversion de type
if (flag === false) {
  // ...
}

if (flag === true) {
  // ...
}
```

> **Pourquoi ?**  
> Utiliser `===` garantit qu’on compare bien des booléens et évite toute conversion implicite de type, ce qui rend le code plus prévisible et plus facile à relire.
---
## Déclarer `v-model` avec `defineModel()`

### ❌ Mauvais code

```ts
<!-- MyDialog.vue -->
<template>
  <PDialog
    v-model="isVisible"
    class="email-dialog"
    @close="handleClose"
  >
    <!-- contenu… -->
  </PDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { defineEmits, defineProps } from 'vue'

const props = defineProps<{ isVisible: boolean }>()
const emit = defineEmits(['update:isVisible'])

// Liaison manuelle de la prop et de l’événement
const isVisible = computed({
  get() {
    return props.isVisible
  },
  set(value: boolean) {
    emit('update:isVisible', value)
  },
})

function handleClose() {
  emit('update:isVisible', false)
}
</script>
```

### ✅ Bon code

```ts
<!-- MyDialog.vue -->
<template>
  <PDialog
    v-model:isVisible="isVisible"
    class="email-dialog"
    @close="handleClose"
  >
    <!-- contenu… -->
  </PDialog>
</template>

<script setup lang="ts">
import { defineModel } from 'vue'

// Crée automatiquement la prop `isVisible` synchronisée
// et émet `update:isVisible` à chaque mutation de .value
const isVisible = defineModel<boolean>('isVisible')

function handleClose() {
  // Met à jour la valeur et émet l’événement
  isVisible.value = false
}
</script>
```

> **Pourquoi ?**
> Avec `defineModel()` (introduit en Vue 3.4), le compilateur génère automatiquement :
>
> 1. La prop `isVisible` pour le binding `v-model:isVisible`
> 2. L’émission de l’événement `update:isVisible` à chaque mutation de `isVisible.value`
>
> Vous vous affranchissez ainsi du boilerplate `defineProps`, `defineEmits` et du `computed`, pour un code plus concis et lisible.
>
> Pour plus de détails, voir la documentation officielle de Vue 3.4 sur [https://vuejs.org/guide/components/v-model#basic-usage](https://vuejs.org/guide/components/v-model#basic-usage).

**Comment ça marche ?**

1. **Dans le parent**

   ```html
   <MyDialog v-model:isVisible="visibleFlag" />
   ```

   Vue passe `visibleFlag` à la prop `isVisible` de l’enfant.
2. **Dans l’enfant**

   ```ts
   const isVisible = defineModel<boolean>('isVisible')
   ```

   * Lire `isVisible.value` renvoie la valeur de `visibleFlag`.
   * Écrire `isVisible.value = newValue` déclenche automatiquement `update:isVisible`, qui met à jour `visibleFlag` dans le parent.
---
## Utiliser une `computed` pour les conditions complexes d’affichage

### ❌ Mauvais code

```ts
<template>
  <div
    v-if="
      selectedEntity !== null &&
      entityServices.length > 0 &&
      selectedEntityAccountNumber !== ''
    "
  >
    <!-- contenu… -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedEntity = ref<Entity | null>(null)
const entityServices = ref<Service[]>([])
const selectedEntityAccountNumber = ref<string>('')
</script>
```

### ✅ Bon code

```ts
<template>
  <div v-if="shouldDisplayEmailPennylane">
    <!-- contenu… -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const selectedEntity = ref<Entity | null>(null)
const entityServices = ref<Service[]>([])
const selectedEntityAccountNumber = ref<string>('')

// Centralisation de la logique dans une computed
const shouldDisplayEmailPennylane = computed(() => {
  return (
    selectedEntity.value !== null &&
    entityServices.value.length > 0 &&
    selectedEntityAccountNumber.value !== ''
  )
})
</script>
```

> **Pourquoi ?**
>
> * Les expressions complexes dans les templates rendent le code difficile à lire et à maintenir.
> * En déplaçant la logique dans une `computed`, on améliore la lisibilité et la testabilité.
> * Les `computed` sont évaluées uniquement lorsque leurs dépendances changent, optimisant ainsi les performances ([vuejs.org][1], [MDN Web Docs][2]).


[1]: https://vuejs.org/guide/essentials/computed?utm_source=chatgpt.com "Computed Properties"
[2]: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Frameworks_libraries/Vue_computed_properties?utm_source=chatgpt.com "Using Vue computed properties - Learn web development"
---

## Prioriser l’utilisation des mocks disponibles

Lorsque vous écrivez des tests, évitez de recréer manuellement vos mocks avec `vi.mock`. Préférez les mocks centralisés fournis dans `@pulse/common/mocks`, et la fonction utilitaire `getStoreMock` pour les stores Pinia.

### ❌ Mauvais code

```ts
// test.spec.ts
import { vi } from 'vitest'

// Mock manuel du store
vi.mock('@pulse/common/stores', () => ({
  useUserStore: () => ({
    getUserId: () => 42,
  }),
}))
```
### ✅ Bon code

```ts
// test.spec.ts
import { createTestingPinia } from '@pinia/testing'
import { getStoreMock }    from '@pulse/common/mocks'
import { useUserStore }    from '@pulse/common/stores'

// Récupération d’un mock Pinia typé pour useUserStore
const userStoreMock = getStoreMock(useUserStore)

// Personnalisation du retour de l’action/getter
userStoreMock.getUserId.mockReturnValue(42)

// → Maintenant, toutes les utilisations de useUserStore().getUserId()
//   retourneront 42, sans avoir à recréer vi.mock manuellement.
```

> **Pourquoi ?**
>
> * Les mocks centralisés garantissent un même comportement partout dans le code.
> * `getStoreMock()` génère un store Pinia typé, avec tous vos getters et actions déjà transformés en `vitest.Mock`, prêts à être configurés.
> * Moins de boilerplate et une maintenance facilitée lorsque vous ajoutez ou modifiez des stores.

### Autres mocks utiles

Dans `@pulse/common/mocks` vous trouverez également :

* `AmplitudeServiceMock`
* `getMockedUserContext()`, `getMockedEntity()`, `getMockedSelectedEntity()`
* …

Importez-les directement pour simuler des contextes, entités ou appels à des services sans réinventer la roue !


