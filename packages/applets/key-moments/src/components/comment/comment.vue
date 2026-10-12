<template>
  <section
    class="key-moments-comment"
    :data-testid="`key-moments-${widgetId}-comment`"
  >
    <h4 class="key-moments-comment__title margin--0">
      <CommentWordmark />
    </h4>

    <p
      v-if="isDiscarded"
      class="
        margin--0
        font-size--12
        font-bold
        text-color--text-neutral-neutral
      "
      :data-testid="`key-moments-${widgetId}-comment-discarded`"
    >
      {{ t('keyMoments.comment.discarded') }}
    </p>

    <!-- Every reading at once, so the firm arbitrates between them without leafing through -->
    <CommentItem
      v-for="variant in orderedVariants"
      :key="variant.key"
      :variant="variant"
      :testIdPrefix="`key-moments-${widgetId}-comment-${variant.key}`"
      :isDisplayed="isDisplayed(variant)"
      :canRetain="canRetain(variant)"
      :canFreeze="canFreeze(variant)"
      @retain="emit('retain', variant)"
      @freeze="emit('retain', variant)"
      @hide="emit('discard')"
      @delete="emit('delete', variant.text, isDisplayed(variant))"
      @save="(text, settle) => emit('save', text, settle)"
    />

    <CommentComposer
      v-if="canCompose === true && draftVariant !== undefined"
      :author="draftVariant"
      :testIdPrefix="`key-moments-${widgetId}-comment-composer`"
      @save="(text, settle) => emit('save', text, settle)"
    />
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CommentComposer from './comment-composer.vue'
import CommentWordmark from './comment-wordmark.vue'
import CommentItem from './comment-item.vue'
import { useCommentList } from './comment.composable'
import type { CommentVariant, SaveSettlement } from '../../types/key-moments.types'

const props = defineProps<{
  widgetId: string
  /** Delivered texts and the readings written, in any order */
  variants: CommentVariant[]
  /** Key of the variant the firm retained; empty while it falls back on the default */
  retainedKey: string
  /** Key of the reading that would be published, retained or fallen back on */
  publishableKey: string
  /** The readings stay readable, but none of them goes out */
  isDiscarded: boolean
  /** Who a first comment is written as, absent when nothing may be written */
  draftVariant?: CommentVariant
}>()

const emit = defineEmits<{
  save: [text: string, settle: SaveSettlement]
  retain: [variant: CommentVariant]
  discard: []
  /** Displayed: emptying the reading the client reads may discard the slot with it */
  delete: [text: string, isDisplayed: boolean]
}>()

const { t } = useI18n()

const {
  orderedVariants,
  canCompose,
  isDisplayed,
  canRetain,
  canFreeze,
} = useCommentList(props)
</script>

<style scoped lang="scss">
.key-moments-comment {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__title {
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: var(--p-jungle-500);
  }
}
</style>
