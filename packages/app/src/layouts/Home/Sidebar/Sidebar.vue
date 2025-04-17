<template>
  <SidebarEntity
    v-if="isEntitiesLoaded && entities?.length && selectedEntity !== undefined"
    :entities="entities"
    :selected-entity="selectedEntity"
  />
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { fetchEntities } from '@app/services/entities'
import type { Entity } from '@pulse/common/types'
import SidebarEntity from './components/SidebarEntity'
import { useSelectedEntityStore } from '@pulse/common/stores'

const selectedEntityStore = useSelectedEntityStore()

const isEntitiesLoaded = ref<boolean>(false)
const entities = ref<Entity[]>([])
const selectedEntity = computed(() => selectedEntityStore.selectedEntity)

onMounted(async () => {
  const { items } = await fetchEntities(2)
  entities.value = items
  isEntitiesLoaded.value = true
})
</script>
