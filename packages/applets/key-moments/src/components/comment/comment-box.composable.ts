import { onUnmounted, ref, toValue, watch } from 'vue'
import { useKeyMomentsEditionStore } from '../../stores/key-moments-edition.store'
import type { MaybeRefOrGetter, Ref } from 'vue'
import type { SaveSettlement } from '../../types/key-moments.types'

export function useCommentBoxEdition(
  isEditing: Ref<boolean>,
  text: MaybeRefOrGetter<string | undefined>,
  onSave: (draftText: string, settle: SaveSettlement) => void,
) {
  const editionStore = useKeyMomentsEditionStore()

  const draft = ref('')
  const isSaving = ref(false)

  // Tracks open edits so the report is not re-rendered over the words being written
  watch(isEditing, (isOpen) => {
    if (isOpen) {
      editionStore.openEdition()
    } else {
      editionStore.closeEdition()
    }
  })

  onUnmounted(() => {
    if (isEditing.value) {
      editionStore.closeEdition()
    }
  })

  // Seeded after render: a caller may switch the text and open the writing in the same tick
  watch(isEditing, (isOpen) => {
    if (isOpen) {
      draft.value = toValue(text) ?? ''
    }
  }, { flush: 'post' })

  // A failed write leaves the encart open on what was typed
  function toggleEdition() {
    if (isSaving.value) {
      return
    }

    if (isEditing.value) {
      isSaving.value = true
      onSave(draft.value, (isSaved) => {
        isSaving.value = false

        if (isSaved) {
          isEditing.value = false
        }
      })

      return
    }

    isEditing.value = true
  }

  return { draft, isSaving, toggleEdition }
}
