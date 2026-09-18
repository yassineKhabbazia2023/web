<template>
  <section class="key-moments-comment-box font-size--13">
    <header
      class="
        flex
        flex--align-items-center
        flex--justify-content-space-between
        flex-gap--2
        margin-bottom--1
      "
    >
      <!-- The generic title is the wordmark, spelled out for screen readers beside it -->
      <span class="key-moments-comment-box__title">
        <template v-if="title === undefined">
          <span
            class="key-moments-comment-box__wordmark flex--align-items-baseline"
            aria-hidden="true"
          >
            {{ t('keyMoments.comment.wordmark') }}

            <PIcon
              class="key-moments-comment-box__monogram"
              pName="rydgeMonogram"
            />
          </span>

          <span
            class="
              key-moments-comment-box__title-text
              position--absolute
              overflow-hidden
              no-wrap
            "
          >
            {{ t('keyMoments.comment.title') }}
          </span>
        </template>

        <template v-else>
          {{ title }}
        </template>
      </span>

      <div
        class="
          flex
          flex--align-items-center
          flex-gap--1
        "
      >
        <slot name="header" />
      </div>
    </header>

    <PInput
      v-if="isEditing"
      v-model="draft"
      pType="textarea"
      :pRows="rows"
      :pPlaceholder="placeholder"
      :pMaxlength="maxLength"
      :pShowWordLimit="maxLength !== undefined"
      :pDisabled="isSaving"
      :pTestId="`${testIdPrefix}-input`"
    />
    <p
      v-else
      class="key-moments-comment-box__text margin--0"
      :class="{ 'font-italic text-color--text-neutral': isEmpty }"
      :data-testid="`${testIdPrefix}-text`"
    >
      {{ isEmpty ? emptyLabel : text }}
    </p>

    <footer
      v-if="hasFooter"
      class="
        flex
        flex--align-items-center
        flex--justify-content-space-between
        flex-gap--2
        margin-top--1
      "
    >
      <span class="key-moments-comment-box__caption">
        <slot name="caption" />
      </span>

      <div
        class="
          flex
          flex--align-items-center
          flex-gap--1
        "
      >
        <slot name="actions" />

        <PButton
          v-if="isEditable"
          pType="primary"
          pSize="small"
          :pLoading="isSaving"
          :pTestId="`${testIdPrefix}-edit-button`"
          @click="toggleEdition"
        >
          {{ isEditing ? t('keyMoments.comment.save') : t('keyMoments.comment.edit') }}
        </PButton>
      </div>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useI18n } from 'vue-i18n'
import { isNullOrEmpty } from '@pulse/toolbox/utils/validator'
import { PButton, PIcon, PInput } from '@pulse/styleguide/components'
import { useCommentBoxEdition } from './comment-box.composable'
import type { SaveSettlement } from '../../types/key-moments.types'

const props = withDefaults(defineProps<{
  /** Prefix applied to the `-input`, `-text` and `-edit-button` test ids */
  testIdPrefix: string
  title?: string
  text?: string
  placeholder?: string
  emptyLabel?: string
  isEditable?: boolean
  rows?: number
  maxLength?: number
}>(), {
  title: undefined,
  maxLength: undefined,
  text: undefined,
  placeholder: '',
  emptyLabel: '',
  isEditable: false,
  rows: 4,
})

const emit = defineEmits<{
  /** `settle` closes the encart once the save is confirmed */
  save: [text: string, settle: SaveSettlement]
}>()

const isEditing = defineModel<boolean>('isEditing', { default: false })

const { t } = useI18n()
const slots = useSlots()

const { draft, isSaving, toggleEdition } = useCommentBoxEdition(
  isEditing,
  () => props.text,
  (draftText, settle) => emit('save', draftText, settle),
)

const isEmpty = computed(() => isNullOrEmpty(props.text))

const hasFooter = computed(() => props.isEditable
  || slots.caption !== undefined
  || slots.actions !== undefined)
</script>

<style scoped lang="scss">
.key-moments-comment-box {
  padding: 15px 18px;
  background-color: var(--p-humming-bird-100);
  line-height: 1.6;

  &__title {
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: var(--p-jungle-500);
  }

  // The flex box swallows the whitespace so that the monogram closes the apostrophe
  &__wordmark {
    display: inline-flex;
    letter-spacing: normal;
  }

  // The R fills the upper 59% of the drawing: scaled to a capital, dropped onto the baseline
  &__monogram {
    margin-left: 1px;
    font-size: 1.3em;
    transform: translateY(0.41em);
  }

  &__title-text {
    width: 1px;
    height: 1px;
    margin: -1px;
    clip-path: inset(50%);
  }

  &__text {
    min-height: 40px;
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }

  &__caption {
    font-size: 10.5px;
    color: var(--p-text-neutral);
  }
}
</style>
