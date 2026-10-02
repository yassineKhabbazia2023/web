<template>
  <article
    class="key-moments-recommendation-card"
    :class="{ 'key-moments-recommendation-card--masked': recommendation.isHidden }"
    :data-testid="testIdPrefix"
  >
    <!-- A div, not a header: the drawer styles every header as a block -->
    <div
      class="
        key-moments-recommendation-card__head
        flex
        flex--align-items-center
        flex-gap--3
      "
    >
      <!-- The handle drags with the mouse and moves with the arrows -->
      <span
        class="key-moments-editor-handle"
        tabindex="0"
        role="button"
        :aria-label="t('keyMoments.recommendations.card.move')"
        :data-testid="`${testIdPrefix}-handle`"
        @keydown.up.prevent="emit('move', 'up')"
        @keydown.down.prevent="emit('move', 'down')"
      >
        <PIcon pName="gripVertical" />
      </span>

      <button
        type="button"
        class="
          key-moments-recommendation-card__toggle
          flex
          flex--align-items-center
          flex-gap--3
          flex--grow-1
          text-left
          padding--0
          cursor-pointer
        "
        :aria-expanded="isOpen"
        :data-testid="`${testIdPrefix}-toggle-button`"
        @click="emit('toggle')"
      >
        <PIcon :pName="isOpen ? 'chevronUp' : 'chevronDown'" />
        <span
          class="
            text-color--text-heading
            font-size--14
            font-bold
            overflow-hidden
            text-overflow--ellipsis
            no-wrap
          "
          :class="{ 'font-italic text-color--text-neutral': hasTheme === false }"
          :data-testid="`${testIdPrefix}-theme`"
        >
          {{ hasTheme ? recommendation.themeLabel : t('keyMoments.recommendations.card.themeMissing') }}
        </span>
        <PTag
          v-if="recommendation.priority !== undefined"
          :pContent="t(`keyMoments.recommendations.priority.${recommendation.priority}`)"
          :pColor="RECOMMENDATION_PRIORITY_COLORS[recommendation.priority]"
          pSize="small"
          pDisableTransitions
          :pTestId="`${testIdPrefix}-priority-badge`"
        />
        <PTag
          v-else
          class="key-moments-recommendation-card__priority-missing"
          :pContent="t('keyMoments.recommendations.card.priorityMissing')"
          pColor="lighter-gray"
          pSize="small"
          pDisableTransitions
          :pTestId="`${testIdPrefix}-priority-badge`"
        />
        <PTag
          :pContent="t('keyMoments.recommendations.card.offerCount', { count: recommendation.offers.length })"
          pColor="light-gray"
          pSize="small"
        />
      </button>

      <!-- The firm alone keeps a line from the client: a category has no client -->
      <label
        v-if="hasVisibility"
        class="
          flex
          flex--align-items-center
          flex-gap--2
          font-small
        "
      >
        <PSwitch
          :modelValue="recommendation.isHidden === false"
          pSize="small"
          :pLabel="t('keyMoments.recommendations.card.visible')"
          :pTestId="`${testIdPrefix}-visible-switch`"
          @update:model-value="(isVisible: boolean) => emit('update', { isHidden: isVisible === false })"
        />
        <span>{{ t('keyMoments.recommendations.card.visible') }}</span>
      </label>
    </div>

    <div
      v-if="isOpen"
      class="key-moments-recommendation-card__body"
      :data-testid="`${testIdPrefix}-body`"
    >
      <!-- Clicking the active priority takes it away -->
      <div
        class="
          flex
          flex--align-items-center
          flex--wrap
          flex-gap--2
        "
      >
        <span
          class="
            key-moments-recommendation-card__label
            key-moments-recommendation-card__label--inline
            text-uppercase
          "
        >
          {{ t('keyMoments.recommendations.card.priority') }}
        </span>
        <!-- Each chip in its priority's colour, the active one ringed rather than recoloured -->
        <button
          v-for="priority in priorities"
          :key="priority"
          type="button"
          class="
            key-moments-recommendation-card__chip
            padding--0
            cursor-pointer
          "
          :class="{ 'key-moments-recommendation-card__chip--selected': recommendation.priority === priority }"
          :aria-pressed="recommendation.priority === priority"
          :data-testid="`${testIdPrefix}-priority-${priority}-button`"
          @click="togglePriority(priority)"
        >
          <PTag
            :pContent="t(`keyMoments.recommendations.priority.${priority}`)"
            :pColor="RECOMMENDATION_PRIORITY_COLORS[priority]"
            pSize="small"
            pDisableTransitions
          />
        </button>
      </div>

      <div class="margin-top--4">
        <span class="key-moments-recommendation-card__label text-uppercase">
          {{ t('keyMoments.recommendations.card.theme') }}
        </span>
        <!-- Only the themes of the rubric: a recommendation never changes rubric -->
        <!-- A line copied from the category keeps its theme -->
        <PDropdown
          class="width--100"
          :modelValue="recommendation.themeId"
          :pDisabled="recommendation.isFromCategory"
          :pOptions="themeOptions"
          :pPlaceholder="t('keyMoments.recommendations.card.themeHint')"
          pFilterable
          :pTestId="`${testIdPrefix}-theme-dropdown`"
          @update:model-value="(themeId: number) => emit('update', { themeId })"
        />
        <!-- Without a theme the line stays on the page and nowhere else -->
        <p
          v-if="hasTheme === false"
          class="
            font-small
            text-color--text-neutral
            margin-top--1
            margin-bottom--0
          "
          :data-testid="`${testIdPrefix}-theme-required`"
        >
          {{ t('keyMoments.recommendations.card.themeRequired') }}
        </p>
        <p
          v-else-if="recommendation.isThemeRefused"
          class="
            font-small
            text-color--text-error
            margin-top--1
            margin-bottom--0
          "
          :data-testid="`${testIdPrefix}-theme-refused`"
        >
          {{ t('keyMoments.recommendations.card.themeRefused') }}
        </p>
      </div>

      <div
        v-for="field in TEXT_FIELDS"
        :key="field"
        class="margin-top--4"
      >
        <span class="key-moments-recommendation-card__label text-uppercase">
          {{ t(`keyMoments.recommendations.card.${field}`) }}
        </span>
        <PInput
          :modelValue="recommendation[field] ?? ''"
          pType="textarea"
          :pRows="3"
          :pMaxlength="RECOMMENDATION_TEXT_MAX_LENGTH"
          :pPlaceholder="t(`keyMoments.recommendations.card.${field}Hint`)"
          :pTestId="`${testIdPrefix}-${field}-input`"
          @update:model-value="(text: string | number) => emit('update', { [field]: String(text) })"
        />
      </div>

      <RecommendationOffers
        class="margin-top--4"
        :offers="recommendation.offers"
        :catalog="catalog"
        :testIdPrefix="testIdPrefix"
        @update="offerIds => emit('update', { offerIds })"
      />

      <div class="flex flex--justify-content-flex-end margin-top--4">
        <PButton
          pSize="small"
          pType="danger"
          :pTestId="`${testIdPrefix}-remove-button`"
          @click="isRemovalAsked = true"
        >
          {{ t('keyMoments.recommendations.card.remove') }}
        </PButton>
      </div>

      <PConfirmationPopup
        pAppendToBody
        :pIsVisible="isRemovalAsked"
        :pTitle="t('keyMoments.recommendations.card.remove')"
        :pConfirmButtonContent="t('keyMoments.recommendations.card.confirmRemove')"
        :pCancelButtonContent="t('keyMoments.recommendations.card.cancel')"
        :pTestId="`${testIdPrefix}-remove-popup`"
        @on-confirm-button-click="confirmRemoval"
        @on-cancel-button-click="isRemovalAsked = false"
      >
        <p>{{ t('keyMoments.recommendations.card.removeText') }}</p>
      </PConfirmationPopup>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PButton,
  PConfirmationPopup,
  PDropdown,
  PIcon,
  PInput,
  PSwitch,
  PTag,
} from '@pulse/styleguide/components'
import { RECOMMENDATION_PRIORITY_COLORS, RECOMMENDATION_TEXT_MAX_LENGTH } from '../../const/key-moments.consts'
import { RecommendationPriority } from '../../enums/key-moments.enums'
import { TEXT_FIELDS } from '../../utils/recommendations.utils'
import RecommendationOffers from './recommendation-offers.vue'
import type { PDropdownOption } from '@pulse/styleguide/types'
import type { RecommendationThemePayload } from '../../services/recommendations.service.types'
import type { SearchableOffer } from '../../types/key-moments.types'
import type { RecommendationView, WorkingRecommendation } from '../../types/recommendations.types'

const props = defineProps<{
  recommendation: RecommendationView
  /** The themes of the card's rubric, in display order */
  themes: RecommendationThemePayload[]
  catalog: SearchableOffer[]
  isOpen: boolean
  /** Offers the switch keeping the line from the client; off for a category, which has none */
  hasVisibility: boolean
}>()

const emit = defineEmits<{
  toggle: []
  /** Emitted on every keystroke */
  update: [patch: Partial<WorkingRecommendation>]
  remove: []
  move: [direction: 'up' | 'down']
}>()

const { t } = useI18n()

const priorities = Object.values(RecommendationPriority)
const isRemovalAsked = ref(false)

const testIdPrefix = computed(() => `key-moments-recommendations-card-${props.recommendation.key}`)
const hasTheme = computed(() => props.recommendation.themeId !== undefined)
const themeOptions = computed<PDropdownOption[]>(() => props.themes
  .map(theme => ({ pValue: theme.id, pLabel: theme.label })))

function togglePriority(priority: RecommendationPriority): void {
  emit('update', { priority: props.recommendation.priority === priority ? undefined : priority })
}

function confirmRemoval(): void {
  isRemovalAsked.value = false
  emit('remove')
}
</script>

<style lang="scss" scoped>
@use '../../styles/editor';
@use '../../styles/screen';

.key-moments-editor-handle {
  @include editor.handle;
}

.key-moments-recommendation-card {
  @include screen.block-surface;

  border-left: 3px solid var(--p-jungle-400);

  // Kept back from the client: greyed, never hidden from the firm
  &--masked {
    background-color: var(--p-gray-100);
    border-left-color: var(--p-gray-400);
    opacity: 0.75;
  }

  &__head {
    padding: 10px 14px;
  }

  &__toggle {
    min-width: 0;
    background: none;
    border: 0;
  }

  &__priority-missing {
    border-style: dashed;
  }

  // The tag draws the chip: the button is only a hit area, ringed when active
  &__chip {
    background: none;
    // No radius: squared like the tag it rings
    border: 2px solid transparent;

    &--selected {
      border-color: var(--p-black-rock-800);
    }
  }

  &__body {
    padding: 4px 14px 16px 46px;
    border-top: 1px solid var(--key-moments-line);
  }

  &__label {
    display: block;
    margin-bottom: 4px;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.08em;
    opacity: 0.7;

    // On the same row as the chips it names: no gap below, centred with them
    &--inline {
      margin-bottom: 0;
    }
  }
}
</style>
