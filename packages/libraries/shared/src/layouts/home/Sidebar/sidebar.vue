<template>
  <SidebarEntity
    v-if="isVisible"
    :current-entity="currentEntity"
    :favorite-entities="favoriteEntities"
    :user-config="userConfig"
    :current-entity-permissions="currentEntityPermissions"
  />
</template>
<script setup lang="ts">
import SidebarEntity from './components/SidebarEntity'
import type { SidebarProps } from './sidebar.types'

defineProps<SidebarProps>()
</script>
