import { computed, ref, watch } from 'vue'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { mostRecentDeliveredVariant } from '../../utils/comment.utils'
import type { CommentVariant } from '../../types/key-moments.types'

interface CommentTabsSource {
  variants: CommentVariant[]
  retainedKey: string
  publishableKey: string
  isDiscarded: boolean
  draftVariant?: CommentVariant
}

export function useCommentTabs(source: CommentTabsSource) {
  const activeKey = ref(source.publishableKey)
  const isEditing = ref(false)

  const hasReaderPickedTab = ref(false)

  watch(() => source.publishableKey, (key) => {
    // A discarded slot names no tab: what was read stays read
    if (key === '') {
      return
    }

    if (hasReaderPickedTab.value === false && isEditing.value === false) {
      activeKey.value = key
    }
  })

  function readVariant(key: string) {
    if (key === activeKey.value) {
      return
    }

    // A draft belongs to one variant: switching tab leaves the edition behind
    isEditing.value = false
    hasReaderPickedTab.value = true
    activeKey.value = key
  }

  const hasMyVariant = computed(() => source.variants.some(variant => variant.isMine))

  // Ends by itself once the saved variant appears under the key the draft carried
  const isWritingFirstText = computed(() => source.draftVariant !== undefined
    && activeKey.value === source.draftVariant.key
    && hasMyVariant.value === false)

  // An empty draft is offered as the `+` button, not as a tab, until writing starts
  const tabs = computed(() => (isWritingFirstText.value && source.draftVariant !== undefined
    ? [...source.variants, source.draftVariant]
    : source.variants))

  const activeVariant = computed(() => tabs.value
    .find(variant => variant.key === activeKey.value)
    ?? mostRecentDeliveredVariant(tabs.value))

  // A fallback reading is still worth retaining: it keeps the next import from rewording it
  const canRetain = computed(() => activeVariant.value !== undefined
    && activeVariant.value.key !== source.retainedKey
    && isNotNullNorEmpty(activeVariant.value.text))

  // Only shown beside the published reading, or it would read as discarding another tab
  const canDiscard = computed(() => source.isDiscarded === false
    && source.publishableKey !== ''
    && activeVariant.value?.key === source.publishableKey)

  const canWrite = computed(() => isEditing.value === false
    && source.draftVariant !== undefined
    && hasMyVariant.value === false)

  function startWriting() {
    hasReaderPickedTab.value = true
    activeKey.value = source.draftVariant?.key ?? activeKey.value
    isEditing.value = true
  }

  return {
    activeKey,
    isEditing,
    tabs,
    activeVariant,
    canRetain,
    canDiscard,
    canWrite,
    readVariant,
    startWriting,
  }
}
