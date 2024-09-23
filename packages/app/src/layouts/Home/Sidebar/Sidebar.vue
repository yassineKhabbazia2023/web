<template>
  <SidebarEntity
    v-if="isEntitiesLoaded && entities?.length"
    :entities="entities"
  />
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchFavoriteEntities, fetchEntities } from '@app/services/entities'
import type { Entity } from '@pulse/Common'
import SidebarEntity from './components/SidebarEntity'

const isEntitiesLoaded = ref<boolean>(false)
const entities = ref<Entity[]>([])

onMounted(async () => {
  await fetchFavoriteEntities()
  const { items } = await fetchEntities()
  entities.value = items
  isEntitiesLoaded.value = true
})
</script>
