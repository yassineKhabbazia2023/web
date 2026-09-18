<template>
  <CommentBox
    v-model:isEditing="isEditing"
    :testIdPrefix="`key-moments-${widgetId}-comment`"
    :text="activeVariant?.text"
    :placeholder="t('keyMoments.comment.placeholder')"
    :emptyLabel="t('keyMoments.comment.empty')"
    :isEditable="isEditing || activeVariant?.isMine === true"
    @save="(text, settle) => emit('save', text, settle)"
  >
    <template #header>
      <div
        class="
          flex
          flex--align-items-center
          flex-gap--1
        "
        role="tablist"
        :aria-label="t('keyMoments.comment.tabsAriaLabel')"
      >
        <PButton
          v-for="variant in tabs"
          :key="variant.key"
          pSize="small"
          :pType="variant.key === activeKey ? 'active' : 'white'"
          role="tab"
          :aria-selected="variant.key === activeKey"
          :title="variant.label"
          :pTestId="`key-moments-${widgetId}-comment-tab-${variant.key}`"
          @click="readVariant(variant.key)"
        >
          {{ variant.tabLabel }}
          <!-- Marks the reading that would go out, arbitrated or fallen back on -->
          <PIcon
            v-if="variant.key === publishableKey"
            class="key-moments-comment__retained-icon"
            pName="check"
            :aria-label="t('keyMoments.comment.publishable')"
          />
        </PButton>
      </div>

      <PButton
        v-if="canWrite"
        pSize="small"
        pType="tertiary"
        :title="t('keyMoments.comment.add')"
        :aria-label="t('keyMoments.comment.add')"
        :pTestId="`key-moments-${widgetId}-comment-add-button`"
        @click="startWriting"
      >
        <PIcon pName="plusLg" />
      </PButton>
    </template>

    <template #caption>
      <span
        v-if="isDiscarded"
        class="font-bold"
        :data-testid="`key-moments-${widgetId}-comment-discarded`"
      >
        {{ t('keyMoments.comment.discarded') }}
      </span>
      <template v-else>
        {{ authorCaption }}
      </template>
    </template>

    <template #actions>
      <PButton
        v-if="canDiscard"
        pType="tertiary"
        pSize="small"
        :pTestId="`key-moments-${widgetId}-comment-discard-button`"
        @click="emit('discard')"
      >
        {{ t('keyMoments.comment.discard') }}
      </PButton>

      <!-- Reintegrating a discarded slot is retaining a reading again -->
      <PButton
        v-if="canRetain && activeVariant !== undefined"
        pType="tertiary"
        pSize="small"
        :pTestId="`key-moments-${widgetId}-comment-retain-button`"
        @click="emit('retain', activeVariant)"
      >
        {{ isDiscarded ? t('keyMoments.comment.reintegrate') : t('keyMoments.comment.retain') }}
      </PButton>
    </template>
  </CommentBox>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PButton, PIcon } from '@pulse/styleguide/components'
import CommentBox from './comment-box.vue'
import { useCommentTabs } from './comment.composable'
import { formatInstant } from '../../utils/date.utils'
import type { CommentVariant, SaveSettlement } from '../../types/key-moments.types'

const props = defineProps<{
  widgetId: string
  /** Delivered texts, oldest version first, then the readings written */
  variants: CommentVariant[]
  /** Key of the retained variant; empty while nothing is retained */
  retainedKey: string
  /** Falls back on its own when nobody arbitrated, unlike `retainedKey` */
  publishableKey: string
  /** The readings stay readable, but none of them goes out */
  isDiscarded: boolean
  /** The tab writing opens on, absent when nothing may be written */
  draftVariant?: CommentVariant
}>()

const emit = defineEmits<{
  save: [text: string, settle: SaveSettlement]
  retain: [variant: CommentVariant]
  discard: []
}>()

const { t } = useI18n()

const {
  activeKey,
  isEditing,
  tabs,
  activeVariant,
  canRetain,
  canDiscard,
  canWrite,
  readVariant,
  startWriting,
} = useCommentTabs(props)

const authorCaption = computed(() => {
  const variant = activeVariant.value

  if (variant === undefined) {
    return ''
  }

  if (variant.updatedAt === undefined) {
    return variant.label
  }

  // An instant, unlike a closing date, is read in the locale of the reader
  return `${variant.label} · ${t('keyMoments.comment.updatedAt', {
    date: formatInstant(variant.updatedAt),
  })}`
})
</script>

<style scoped lang="scss">
.key-moments-comment {
  &__retained-icon {
    margin-left: 2px;
  }
}
</style>
