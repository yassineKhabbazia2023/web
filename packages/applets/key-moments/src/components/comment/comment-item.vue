<template>
  <article
    class="
      key-moments-comment-item
      flex
      flex-gap--3
    "
    :class="{ 'key-moments-comment-item--displayed': isDisplayed }"
    :data-testid="testIdPrefix"
  >
    <PAvatar
      class="flex--shrink-0"
      pType="small"
      :pColor="variant.contributorId === null ? 'teal' : 'persian-600'"
    >
      <!-- A delivered text has no author to abbreviate: it is signed by the firm -->
      <PIcon
        v-if="variant.contributorId === null"
        pName="rydgeMonogram"
      />
      <template v-else>
        {{ variant.tabLabel }}
      </template>
    </PAvatar>

    <div class="key-moments-comment-item__content">
      <header
        class="
          flex
          flex--wrap
          flex--align-items-center
          flex-gap--2
        "
      >
        <span class="key-moments-comment-item__author">{{ variant.label }}</span>
        <span
          v-if="variant.updatedAt !== undefined"
          class="key-moments-comment-item__date"
        >
          {{ formatInstantWithTime(variant.updatedAt) }}
        </span>
        <span
          v-if="isDisplayed"
          class="key-moments-comment-item__badge"
          :data-testid="`${testIdPrefix}-retained-badge`"
        >
          {{ t('keyMoments.comment.retainedBadge') }}
        </span>

        <div
          class="
            flex
            flex--align-items-center
            flex-gap--1
            margin-left--auto
          "
        >
          <PTooltip
            v-if="canRetain === true && isEditing === false"
            :pContent="t('keyMoments.comment.retain')"
            pPlacement="top"
          >
            <PButton
              pType="tertiary"
              pSize="small"
              pIconOnly
              :aria-label="t('keyMoments.comment.retain')"
              :pTestId="`${testIdPrefix}-retain-button`"
              @click="emit('retain')"
            >
              <PIcon pName="patchCheck" />
            </PButton>
          </PTooltip>
          <PTooltip
            v-if="canFreeze === true && isEditing === false"
            :pContent="t('keyMoments.comment.freezeHint')"
            pPlacement="top"
          >
            <PButton
              pType="tertiary"
              pSize="small"
              :pTestId="`${testIdPrefix}-freeze-button`"
              @click="emit('freeze')"
            >
              {{ t('keyMoments.comment.freeze') }}
            </PButton>
          </PTooltip>
          <PTooltip
            v-if="isDisplayed && isEditing === false"
            :pContent="t('keyMoments.comment.hide')"
            pPlacement="top"
          >
            <PButton
              pType="tertiary"
              pSize="small"
              pIconOnly
              :aria-label="t('keyMoments.comment.hide')"
              :pTestId="`${testIdPrefix}-hide-button`"
              @click="emit('hide')"
            >
              <PIcon pName="eyeSlash" />
            </PButton>
          </PTooltip>
          <PTooltip
            v-if="variant.isMine && isEditing === false"
            :pContent="t('keyMoments.comment.edit')"
            pPlacement="top"
          >
            <PButton
              pType="tertiary"
              pSize="small"
              pIconOnly
              :aria-label="t('keyMoments.comment.edit')"
              :pTestId="`${testIdPrefix}-edit-button`"
              @click="toggleEdition"
            >
              <PIcon pName="pencilSquare" />
            </PButton>
          </PTooltip>
          <PTooltip
            v-if="variant.isMine && isEditing === false"
            :pContent="t('keyMoments.comment.delete')"
            pPlacement="top"
          >
            <PButton
              pType="tertiary"
              pSize="small"
              pIconOnly
              :aria-label="t('keyMoments.comment.delete')"
              :pTestId="`${testIdPrefix}-delete-button`"
              @click="emit('delete')"
            >
              <PIcon pName="trash" />
            </PButton>
          </PTooltip>
        </div>
      </header>

      <template v-if="isEditing">
        <PInput
          v-model="draft"
          class="margin-top--2"
          pType="textarea"
          :pRows="3"
          :pPlaceholder="t('keyMoments.comment.placeholder')"
          :pDisabled="isSaving"
          :pTestId="`${testIdPrefix}-input`"
        />
        <div
          class="
            flex
            flex-gap--2
            margin-top--2
          "
        >
          <PButton
            pType="primary"
            pSize="small"
            :pDisabled="isDraftEmpty"
            :pLoading="isSaving"
            :pTestId="`${testIdPrefix}-save-button`"
            @click="toggleEdition"
          >
            {{ t('keyMoments.comment.save') }}
          </PButton>
          <PButton
            pType="secondary"
            pSize="small"
            :pDisabled="isSaving"
            :pTestId="`${testIdPrefix}-cancel-button`"
            @click="isEditing = false"
          >
            {{ t('keyMoments.comment.cancel') }}
          </PButton>
        </div>
      </template>
      <p
        v-else
        class="key-moments-comment-item__text"
        :data-testid="`${testIdPrefix}-text`"
      >
        {{ variant.text }}
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { isNullOrEmpty } from '@pulse/toolbox/utils/validator'
import {
  PAvatar,
  PButton,
  PIcon,
  PInput,
  PTooltip,
} from '@pulse/styleguide/components'
import { useCommentBoxEdition } from './comment-box.composable'
import { formatInstantWithTime } from '../../utils/date.utils'
import type { CommentVariant, SaveSettlement } from '../../types/key-moments.types'

const props = defineProps<{
  variant: CommentVariant
  /** Stem of the `data-testid` of the card and of its actions */
  testIdPrefix: string
  /** The comment the client reads, retained or fallen back on */
  isDisplayed: boolean
  canRetain: boolean
  /** Displayed by default only: retaining it keeps the next import from replacing it */
  canFreeze: boolean
}>()

const emit = defineEmits<{
  retain: []
  freeze: []
  hide: []
  /** Asked, not done: the page confirms it, outside the widget that would clip its dialog */
  delete: []
  save: [text: string, settle: SaveSettlement]
}>()

const { t } = useI18n()

const isEditing = ref(false)

const { draft, isSaving, toggleEdition } = useCommentBoxEdition(
  isEditing,
  () => props.variant.text,
  (draftText, settle) => emit('save', draftText, settle),
)

// Emptying my comment is deleting it, which goes through its confirmed action
const isDraftEmpty = computed(() => isNullOrEmpty(draft.value.trim()))
</script>

<style scoped lang="scss">
.key-moments-comment-item {
  padding: 14px 16px;
  font-size: 13px;
  line-height: 1.55;
  background-color: var(--p-surface-primary);
  border-left: 3px solid transparent;
  box-shadow: 0 1px 2px rgba(var(--p-black-rock-900-rgb), 0.06);

  &--displayed {
    border-left-color: var(--p-jungle-400);
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__author {
    font-weight: 700;
    color: var(--p-text-heading);
  }

  &__date {
    font-size: 11.5px;
    color: var(--p-text-neutral);
  }

  &__badge {
    padding: 3px 9px;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: var(--p-white);
    background-color: var(--p-jungle-400);
  }

  &__text {
    margin: 4px 0 0;
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }
}
</style>
