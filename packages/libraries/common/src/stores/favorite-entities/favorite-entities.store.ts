import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Entity } from '../types'

export const useFavoriteEntitiesStore = defineStore('selected-entities', () => {
  const favoriteEntities = ref<Entity[]>([])

  function setFavoriteEntities(entitiesArg: Entity[]) {
    favoriteEntities.value = entitiesArg
  }

  return {
    favoriteEntities,
    setFavoriteEntities,
  }
})
