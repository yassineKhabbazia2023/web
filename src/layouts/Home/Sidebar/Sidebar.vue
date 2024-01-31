<template>
  <SidebarEntity :favoriteEntities="favoriteEntities" />
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { commonStore } from '@kpmg/common'
import type { Entity } from './components/SidebarEntity/components/EntityAvatar/EntityAvatarTypes'
import SidebarEntity from './components/SidebarEntity'

const userStore = commonStore()
const { user } = storeToRefs(userStore)

const favoriteEntities = ref<Entity[]>([])

const getFavoriteEntities = () => {
  let storedFavEntities = user.value?.entities?.favorites as Entity[] ?? []

  // The following code is temporary as there is currently no information about ibs returned from the API
  storedFavEntities = storedFavEntities.map((item: any) => {
    return {
      ...item,
      ibs: 'IBS93773820QE19'
    }
  })

  return storedFavEntities
}

watch(
  user,
  () => {
    favoriteEntities.value = getFavoriteEntities()
  },
  { deep: true }
)

onMounted(() => {
  favoriteEntities.value = getFavoriteEntities()
})
</script>
