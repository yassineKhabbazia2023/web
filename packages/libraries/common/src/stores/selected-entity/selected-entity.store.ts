import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Entity } from '../types'

export const useSelectedEntityStore = defineStore('selected-entity', () => {
  const selectedEntity = ref<Entity>()
  const selectedEntityId = computed(() => selectedEntity.value?.accountId)
  const selectedEntityAccountNumber = computed(() => selectedEntity.value?.accountNumber?.toString() ?? '')

  function setSelectedEntity(selectedEntityArg?: Entity) {
    selectedEntity.value = selectedEntityArg
  }

  function reset() {
    selectedEntity.value = undefined
  }

  return {
    selectedEntity,
    selectedEntityId,
    setSelectedEntity,
    selectedEntityAccountNumber,
    reset,
  }
})
