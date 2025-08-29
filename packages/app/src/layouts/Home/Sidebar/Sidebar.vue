<template>
  <SidebarEntity
    v-if="isVisible === true"
    :selected-entity="selectedEntityStore.selectedEntity"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue'
import SidebarEntity from './components/SidebarEntity'
import { useSelectedEntityStore, useUserStore } from '@pulse/common/stores'

const selectedEntityStore = useSelectedEntityStore()
const userStore = useUserStore()

const isVisible = computed(() => {
  const user = userStore.user
  const selectedEntity = selectedEntityStore.selectedEntity

  return user !== undefined && selectedEntity !== undefined
})
</script>
