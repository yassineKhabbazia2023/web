import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { KeyMomentsDraft } from './key-moments-draft.types'

/**
 * Carries the draft from the editor to the preview, which is another route and
 * shares none of its state. In memory only: a preview reached by a reload or a
 * direct link finds it empty, and falls back on what is published.
 */
export const useKeyMomentsDraftStore = defineStore('key-moments-draft', () => {
  const draft = ref<KeyMomentsDraft>()

  function setDraft(next: KeyMomentsDraft): void {
    draft.value = next
  }

  function clearDraft(): void {
    draft.value = undefined
  }

  return { draft, setDraft, clearDraft }
})
