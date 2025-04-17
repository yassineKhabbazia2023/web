import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Entity } from '../types'

export const useSelectedEntityStore = defineStore('selected-entity', () => {
  const selectedEntity = ref<Entity>()

  function setSelectedEntity(selectedEntityArg?: Entity) {
    selectedEntity.value = selectedEntityArg
  }

  return {
    selectedEntity,
    setSelectedEntity,
  }
})
