import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * How many comment encarts are being written in. While at least one is open,
 * the report is laid out again in place instead of re-entering as a new one,
 * which would otherwise drop the words being typed. Counted, not flagged,
 * since several encarts can be open at once.
 */
export const useKeyMomentsEditionStore = defineStore('key-moments-edition', () => {
  const openEditionCount = ref(0)

  const hasOpenEdition = computed(() => openEditionCount.value > 0)

  function openEdition(): void {
    openEditionCount.value += 1
  }

  function closeEdition(): void {
    openEditionCount.value = Math.max(0, openEditionCount.value - 1)
  }

  return { openEditionCount, hasOpenEdition, openEdition, closeEdition }
})
