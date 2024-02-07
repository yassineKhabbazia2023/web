<template>
  <SidebarEntity
    v-if="isEntitiesLoaded"
    :totalEntities="totalEntities"
  />
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFavoriteEntities, getEntities } from '@/services/entities'
import SidebarEntity from './components/SidebarEntity'

const isEntitiesLoaded = ref<boolean>(false)
const totalEntities = ref<number>(0)

onMounted(async () => {
  await getFavoriteEntities()
  const { totalItems } = await getEntities()
  totalEntities.value = totalItems as number
  isEntitiesLoaded.value = true
})
</script>
