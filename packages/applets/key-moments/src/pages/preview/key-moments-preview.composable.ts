import { computed, ref } from 'vue'
import { useKeyMomentsDraftStore } from '../../stores/key-moments-draft.store'
import { buildDraftReport } from '../../utils/draft.utils'
import { PublicationState } from '../../enums/key-moments.enums'
import { PreviewMode } from './key-moments-preview.enums'
import type { Ref } from 'vue'
import type { PublicationPayload } from '../../services/key-moments.service.types'

/**
 * Which of the two key moments the preview shows, and what the draft one is
 * laid out as.
 *
 * The draft is read from the store the editor filled on the click, and only
 * when it speaks of the exercice on screen: a preview reloaded, reached by a
 * link, or moved to another exercice has no draft to show and falls back on
 * what is published.
 */
export function useKeyMomentsPreview(
  exerciceId: Readonly<Ref<number | undefined>>,
  publication: Readonly<Ref<PublicationPayload | undefined>>,
) {
  const draftStore = useKeyMomentsDraftStore()

  /**
   * A draft that matches the publication is not one: what the client reads is
   * already what it would read, so the preview offers the publication alone.
   */
  const draft = computed(() => {
    const held = draftStore.draft

    return held !== undefined
      && held.exerciceId === exerciceId.value
      && held.publicationState !== PublicationState.UP_TO_DATE
      ? held
      : undefined
  })

  const hasDraft = computed(() => draft.value !== undefined)

  /**
   * Opens on the draft when there is one — the preview is there to read what
   * the client does not see yet — and on what is published otherwise. Nothing
   * at all when neither exists.
   */
  const defaultMode = computed<PreviewMode | undefined>(() => {
    if (hasDraft.value) {
      return PreviewMode.DRAFT
    }

    return publication.value === undefined ? undefined : PreviewMode.PUBLISHED
  })

  /** The reader's choice, which outlives nothing: a new exercice settles its own. */
  const selectedMode = ref<PreviewMode>()

  /**
   * A choice that no longer applies — the draft was published and cleared,
   * the exercice changed — gives way to the default rather than to nothing.
   */
  const mode = computed(() => (
    selectedMode.value === PreviewMode.DRAFT && hasDraft.value === false
      ? defaultMode.value
      : selectedMode.value ?? defaultMode.value
  ))

  function selectMode(next: PreviewMode): void {
    selectedMode.value = next
  }

  /** Shown only when both a publication and a draft exist, so the reader can compare them. */
  const isModeSegmentVisible = computed(() => publication.value !== undefined && hasDraft.value)

  /**
   * The unit the editor holds the draft in, and no other: the preview reads
   * what the client would be served, and that reading was settled before the
   * report reached it.
   */
  const isInThousands = computed(() => draft.value?.isInThousands ?? false)

  const draftReport = computed(() => (draft.value === undefined
    ? undefined
    : buildDraftReport(draft.value, isInThousands.value)))

  return {
    draft,
    mode,
    selectMode,
    isModeSegmentVisible,
    isInThousands,
    draftReport,
  }
}
