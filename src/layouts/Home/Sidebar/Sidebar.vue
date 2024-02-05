<template>
  <SidebarEntity
    :favoriteEntities="favEntities"
    :totalEntities="totalEntities"
  />
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { commonStore, type Entity } from '@kpmg/common'
import { getFavoriteEntities, getEntities } from '@/services/entities'
import SidebarEntity from './components/SidebarEntity'

const userStore = commonStore()
const { user, favoriteEntities } = storeToRefs(userStore)

const favEntities = ref<Entity[]>([])
const totalEntities = ref<number>(0)

watch(
  user,
  () => {
    favEntities.value = favoriteEntities.value
  },
  { deep: true }
)

onMounted(async () => {
  await getFavoriteEntities()
  const { totalItems } = await getEntities()
  totalEntities.value = totalItems as number
  favEntities.value = favoriteEntities.value
})
</script>
