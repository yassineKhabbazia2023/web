<template>
  <PDialog
    v-model="isOpen"
    :pTitle="title"
    :pWidth="dialogWidth"
    pDestroyOnClose
    pAppendToBody
    pTestId="key-moments-recommendations-offers-picker"
    @close="forgetNarrowings"
  >
    <PInput
      v-model="searchTerm"
      pClearable
      pPrefixIconName="search"
      :pPlaceholder="t('keyMoments.recommendations.picker.search')"
      pTestId="key-moments-recommendations-offers-picker-search-input"
    />

    <!-- One tag at a time, each chip in its tag's colour: the active one is ringed, not recoloured -->
    <div
      class="
        key-moments-recommendations-offers-picker__tags
        flex
        flex--wrap
        flex-gap--2
        margin-top--4
      "
    >
      <button
        type="button"
        class="
          key-moments-recommendations-offers-picker__chip
          padding--0
          cursor-pointer
        "
        :class="{
          'key-moments-recommendations-offers-picker__chip--selected': selectedTag === undefined,
        }"
        data-testid="key-moments-recommendations-offers-picker-tag-all"
        @click="selectedTag = undefined"
      >
        <PTag
          :pContent="t('keyMoments.recommendations.picker.allTags')"
          pColor="light-gray"
          pSize="small"
        />
      </button>
      <button
        v-for="tag in tags"
        :key="tag"
        type="button"
        class="
          key-moments-recommendations-offers-picker__chip
          padding--0
          cursor-pointer
        "
        :class="{ 'key-moments-recommendations-offers-picker__chip--selected': selectedTag === tag }"
        :data-testid="`key-moments-recommendations-offers-picker-tag-${offerTagTestId(tag)}`"
        @click="selectedTag = tag"
      >
        <PTag
          :pContent="tag"
          :pColor="offerTagColor(tag)"
          pSize="small"
        />
      </button>
    </div>

    <PAlert
      v-if="results.length === 0"
      class="margin-top--4"
      pType="info"
      data-testid="key-moments-recommendations-offers-picker-empty"
    >
      {{ t('keyMoments.recommendations.picker.empty') }}
    </PAlert>

    <div
      v-else
      class="
        key-moments-recommendations-offers-picker__results
        grid
        grid-cols--3
        grid-gap--4
        margin-top--4
      "
    >
      <article
        v-for="offer in results"
        :key="offer.id"
        class="
          key-moments-recommendations-offers-picker__offer
          flex
          flex--direction-column
          bg--surface-basic-primary
        "
        :class="{ 'key-moments-recommendations-offers-picker__offer--selected': isSelected(offer.id) }"
        :data-testid="`key-moments-recommendations-offers-picker-offer-${offer.id}`"
      >
        <h4 class="key-moments-recommendations-offers-picker__title text-color--text-basic-heading">
          {{ offer.title }}
        </h4>
        <p class="key-moments-recommendations-offers-picker__description">
          {{ offer.shortDescription }}
        </p>

        <!-- Same tags and colours as the offers catalogue -->
        <div
          v-if="offer.tags !== undefined && offer.tags.length > 0"
          class="flex flex--wrap flex-gap--2"
          :data-testid="`key-moments-recommendations-offers-picker-offer-${offer.id}-tags`"
        >
          <PTag
            v-for="tag in offer.tags"
            :key="tag"
            :pContent="tag"
            :pColor="offerTagColor(tag)"
            pSize="small"
          />
        </div>

        <PButton
          pSize="small"
          :pType="isSelected(offer.id) ? 'active' : 'primary'"
          :pTestId="`key-moments-recommendations-offers-picker-offer-${offer.id}-toggle-button`"
          @click="toggleOffer(offer.id)"
        >
          {{ isSelected(offer.id)
            ? t('keyMoments.recommendations.picker.selected')
            : t('keyMoments.recommendations.picker.choose') }}
        </PButton>
      </article>
    </div>

    <template #footer>
      <div
        class="
          flex
          flex--align-items-center
          flex--justify-content-space-between
          flex-gap--4
        "
      >
        <span
          class="font-size--13"
          data-testid="key-moments-recommendations-offers-picker-count"
        >
          {{ t('keyMoments.recommendations.picker.count', { count: selectedCount }, selectedCount) }}
        </span>
        <div class="flex flex-gap--2">
          <PButton
            pType="default"
            pTestId="key-moments-recommendations-offers-picker-cancel-button"
            @click="isOpen = false"
          >
            {{ t('keyMoments.recommendations.picker.cancel') }}
          </PButton>
          <PButton
            pType="primary"
            pTestId="key-moments-recommendations-offers-picker-validate-button"
            @click="validateSelection"
          >
            {{ t('keyMoments.recommendations.picker.validate') }}
          </PButton>
        </div>
      </div>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResponsive } from '@pulse/styleguide'
import { PAlert, PButton, PDialog, PInput, PTag } from '@pulse/styleguide/components'
import { useRecommendationOffersSelection } from './recommendation-offers-picker.composable'
import {
  catalogTags,
  filterCatalog,
  offerTagColor,
  offerTagTestId,
} from '../../../utils/offers.utils'
import type { SearchableOffer } from '../../../types/key-moments.types'

const props = defineProps<{
  catalog: SearchableOffer[]
  title: string
  /** The offers already attached to the recommendation, preselected on opening */
  initialSelection: number[]
}>()

const emit = defineEmits<{
  validate: [offerIds: number[]]
}>()

const isOpen = defineModel<boolean>({ required: true })

const { t } = useI18n()

const { isMobile } = useResponsive()

// A dialog does not shrink to a phone: it takes the screen, less the overlay margin
const dialogWidth = computed(() => (isMobile.value ? 'calc(100vw - 24px)' : '920px'))

const searchTerm = ref('')
const selectedTag = ref<string>()

/** Recomputed only when the catalogue lands, never on a keystroke. */
const tags = computed(() => catalogTags(props.catalog))

const results = computed(
  () => filterCatalog(props.catalog, searchTerm.value, selectedTag.value),
)

const {
  selectedCount,
  isSelected,
  toggleOffer,
  reset,
  validateSelection: validate,
} = useRecommendationOffersSelection({
  catalog: () => props.catalog,
  initialSelection: () => props.initialSelection,
  onValidate: offerIds => emit('validate', offerIds),
})

// The opening is decided by the parent through the model: the selection
// restarts from what is attached each time it turns true
watch(isOpen, (isNowOpen) => {
  if (isNowOpen) {
    reset()
  }
}, { immediate: true })

// Closing forgets the search and the tag, so a reopened picker starts clean
function forgetNarrowings(): void {
  searchTerm.value = ''
  selectedTag.value = undefined
}

function validateSelection(): void {
  validate()
  isOpen.value = false
}
</script>

<style lang="scss" scoped>
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;
@use '../../../styles/screen';

.key-moments-recommendations-offers-picker {
  &__results {
    max-height: 26rem;
    overflow-y: auto;

    @media (width <= 900px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    // A card holds a title, a sentence and its tags: two of them fit no phone
    @include breakpoints.media(xs) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__offer {
    gap: 0.5rem;
    padding: 1rem;
    border: 1px solid var(--key-moments-line);

    &--selected {
      border-color: var(--p-black-rock-800);
    }
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

  &__title {
    @include screen.card-title;
  }

  // Pushes the button down to the foot of the card
  &__description {
    @include screen.card-text;

    margin-bottom: auto;
  }
}
</style>
