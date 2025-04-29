<template>
  <SidebarEntity
    v-if="selectedEntity !== undefined"
    :selected-entity="selectedEntity"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue'
import SidebarEntity from './components/SidebarEntity'
import { useSelectedEntityStore } from '@pulse/common/stores'

const selectedEntityStore = useSelectedEntityStore()

const selectedEntity = computed(() => selectedEntityStore.selectedEntity)
</script>
