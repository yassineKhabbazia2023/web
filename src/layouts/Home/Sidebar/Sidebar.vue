<template>
  <SidebarEntity
    v-if="isEntitiesLoaded && entities?.length"
    :entities="entities"
  />
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFavoriteEntities, getEntities } from '@/services/entities'
import type { Entity } from '@kpmg/common'
import SidebarEntity from './components/SidebarEntity'

const isEntitiesLoaded = ref<boolean>(false)
const entities = ref<Entity[]>([])

onMounted(async () => {
  await getFavoriteEntities()
  const { items } = await getEntities()
  entities.value = items
  isEntitiesLoaded.value = true
})
</script>
