import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', () => {
  const isGlobalLoading = ref(false)

  function startGlobalLoading() {
    isGlobalLoading.value = true
  }

  function stopGlobalLoading() {
    isGlobalLoading.value = false
  }

  function reset() {
    isGlobalLoading.value = false
  }

  return {
    isGlobalLoading,
    startGlobalLoading,
    stopGlobalLoading,
    reset,
  }
})
