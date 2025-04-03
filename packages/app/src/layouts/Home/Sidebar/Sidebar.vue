<template>
  <SidebarEntity
    v-if="isEntitiesLoaded && entities?.length"
    :entities="entities"
  />
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchEntities } from '@app/services/entities'
import type { Entity } from '@pulse/common/types'
import SidebarEntity from './components/SidebarEntity'

const isEntitiesLoaded = ref<boolean>(false)
const entities = ref<Entity[]>([])

onMounted(async () => {
  const { items } = await fetchEntities(2)
  entities.value = items
  isEntitiesLoaded.value = true
})
</script>
