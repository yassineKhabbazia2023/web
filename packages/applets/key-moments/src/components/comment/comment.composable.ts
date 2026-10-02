import { computed } from 'vue'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import type { CommentVariant } from '../../types/key-moments.types'

interface CommentListSource {
  variants: CommentVariant[]
  retainedKey: string
  publishableKey: string
  isDiscarded: boolean
  draftVariant?: CommentVariant
}

export function useCommentList(source: CommentListSource) {
  // Read in the order they were written; an undated delivery opens the list, versions in order
  const orderedVariants = computed(() => [...source.variants]
    .sort((left, right) => (left.updatedAt ?? '').localeCompare(right.updatedAt ?? '')))

  // A default the firm never arbitrated is shown as retained: it is what the client would read
  const displayedKey = computed(() => (source.isDiscarded ? '' : source.publishableKey))

  const hasMyVariant = computed(() => source.variants.some(variant => variant.isMine))

  // One comment per person: once mine exists it is edited in place, never written again
  const canCompose = computed(() => source.draftVariant !== undefined
    && hasMyVariant.value === false)

  function isDisplayed(variant: CommentVariant): boolean {
    return variant.key === displayedKey.value
  }

  function canRetain(variant: CommentVariant): boolean {
    return isDisplayed(variant) === false && isNotNullNorEmpty(variant.text)
  }

  /**
   * The default follows the latest delivered version: retaining it explicitly
   * freezes it, so that the next import does not reword what the client reads.
   */
  function canFreeze(variant: CommentVariant): boolean {
    return isDisplayed(variant)
      && variant.key !== source.retainedKey
      && isNotNullNorEmpty(variant.text)
  }

  return {
    orderedVariants,
    canCompose,
    isDisplayed,
    canRetain,
    canFreeze,
  }
}
