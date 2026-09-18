import { ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * Whether the key moments entry belongs to the dossier in context.
 *
 * Held in a store rather than recomputed by each surface: the answer costs a
 * call to the account, and two surfaces read it — the sidebar entry and the
 * homepage widget. `CurrentEntityManager` fills it once when the dossier is
 * loaded, everything else only reads.
 */
export const useKeyMomentsAccessStore = defineStore('key-moments-access', () => {
  const canShowKeyMoments = ref(false)

  function setCanShowKeyMoments(canShow: boolean) {
    canShowKeyMoments.value = canShow
  }

  function reset() {
    canShowKeyMoments.value = false
  }

  return {
    canShowKeyMoments,
    setCanShowKeyMoments,
    reset,
  }
})
