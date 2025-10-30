import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false)

  function startLoading() {
    isLoading.value = true
  }

  function stopLoading() {
    isLoading.value = false
  }

  function reset() {
    isLoading.value = false
  }

  return {
    isLoading,
    startLoading,
    stopLoading,
    reset,
  }
})
