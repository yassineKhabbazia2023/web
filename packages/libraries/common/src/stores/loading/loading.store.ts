import { type Ref, ref } from 'vue'
import { defineStore } from 'pinia'

const LOADING_DELAY_MS = 250

export const useLoadingStore = defineStore('loading', () => {
  const timers = new Map<Ref<boolean>, ReturnType<typeof setTimeout>>()
  const isGlobalLoading = ref(false)
  const isContentLoading = ref(false)

  function startLoading(loadingRef: Ref<boolean>) {
    if (timers.has(loadingRef) || loadingRef.value === true) {
      return
    }
    timers.set(loadingRef, setTimeout(() => {
      loadingRef.value = true
      timers.delete(loadingRef)
    }, LOADING_DELAY_MS))
  }

  function clearLoading(loadingRef: Ref<boolean>) {
    const timer = timers.get(loadingRef)
    if (timer !== undefined) {
      clearTimeout(timer)
      timers.delete(loadingRef)
    }
    loadingRef.value = false
  }

  function startGlobalLoading(options: { immediate?: boolean } = {}) {
    if (options.immediate === true) {
      isGlobalLoading.value = true
      return
    }

    startLoading(isGlobalLoading)
  }

  function stopGlobalLoading() {
    clearLoading(isGlobalLoading)
  }

  function startContentLoading() {
    startLoading(isContentLoading)
  }

  function stopContentLoading() {
    clearLoading(isContentLoading)
  }

  function reset() {
    stopGlobalLoading()
    stopContentLoading()
  }

  return {
    isGlobalLoading,
    isContentLoading,
    startGlobalLoading,
    stopGlobalLoading,
    startContentLoading,
    stopContentLoading,
    reset,
  }
})
