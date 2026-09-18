<template>
  <PDialog
    v-model="isOpen"
    :pTitle="t('keyMoments.offers.picker.title', { year: exerciceYear })"
    :pWidth="dialogWidth"
    pDestroyOnClose
    pAppendToBody
    pTestId="key-moments-offers-picker"
    @close="forgetNarrowings"
  >
    <PInput
      v-model="searchTerm"
      pClearable
      pPrefixIconName="search"
      :pPlaceholder="t('keyMoments.offers.picker.search')"
      pTestId="key-moments-offers-picker-search-input"
    />

    <!-- One tag at a time, each chip in its tag's colour: the active one is ringed, not recoloured -->
    <div
      class="
        key-moments-offers-picker__tags
        flex
        flex--wrap
        flex-gap--2
        margin-top--4
      "
    >
      <button
        type="button"
        class="
          key-moments-offers-picker__chip
          padding--0
          cursor-pointer
        "
        :class="{
          'key-moments-offers-picker__chip--selected': selectedTag === undefined,
        }"
        data-testid="key-moments-offers-picker-tag-all"
        @click="selectedTag = undefined"
      >
        <PTag
          :pContent="t('keyMoments.offers.picker.allTags')"
          pColor="light-gray"
          pSize="small"
        />
      </button>
      <button
        v-for="tag in tags"
        :key="tag"
        type="button"
        class="
          key-moments-offers-picker__chip
          padding--0
          cursor-pointer
        "
        :class="{ 'key-moments-offers-picker__chip--selected': selectedTag === tag }"
        :data-testid="`key-moments-offers-picker-tag-${offerTagTestId(tag)}`"
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
      data-testid="key-moments-offers-picker-empty"
    >
      {{ t('keyMoments.offers.picker.empty') }}
    </PAlert>

    <div
      v-else
      class="
        key-moments-offers-picker__results
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
          key-moments-offers-picker__offer
          flex
          flex--direction-column
          bg--surface-primary
        "
        :data-testid="`key-moments-offers-picker-offer-${offer.id}`"
      >
        <h4 class="key-moments-offers-picker__title text-color--text-heading">
          {{ offer.title }}
        </h4>
        <p class="key-moments-offers-picker__description">
          {{ offer.shortDescription }}
        </p>

        <!-- Same tags and colours as the offers catalogue -->
        <div
          v-if="offer.tags !== undefined && offer.tags.length > 0"
          class="flex flex--wrap flex-gap--2"
          :data-testid="`key-moments-offers-picker-offer-${offer.id}-tags`"
        >
          <PTag
            v-for="tag in offer.tags"
            :key="tag"
            :pContent="tag"
            :pColor="offerTagColor(tag)"
            pSize="small"
          />
        </div>

        <!-- A duplicate is prevented here: the microservice would refuse it -->
        <span
          v-if="attachedIds.has(offer.id)"
          class="
            key-moments-offers-picker__chosen
            font-size--13
            font-italic
          "
          :data-testid="`key-moments-offers-picker-offer-${offer.id}-chosen`"
        >
          {{ t('keyMoments.offers.picker.chosen') }}
        </span>
        <PButton
          v-else
          pSize="small"
          pType="primary"
          :pDisabled="isAtCap || isSaving"
          :pTestId="`key-moments-offers-picker-offer-${offer.id}-choose-button`"
          @click="choose(offer)"
        >
          {{ t('keyMoments.offers.picker.choose') }}
        </PButton>
      </article>
    </div>
  </PDialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResponsive } from '@pulse/styleguide'
import { PAlert, PButton, PDialog, PInput, PTag } from '@pulse/styleguide/components'
import {
  catalogTags,
  filterCatalog,
  offerTagColor,
  offerTagTestId,
} from '../../utils/offers.utils'
import type { SearchableOffer } from '../../types/key-moments.types'
import type { CatalogOfferPayload } from '../../services/offers.service.types'

const props = defineProps<{
  catalog: SearchableOffer[]
  attachedIds: Set<number>
  isAtCap: boolean
  /** A write of the list in flight: choosing waits for the microservice to answer */
  isSaving: boolean
  /** Year the exercice closes on, as every selector of the page names it */
  exerciceYear: string
}>()

const emit = defineEmits<{
  choose: [offer: CatalogOfferPayload]
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

// Closing forgets the search and the tag, so a reopened picker starts clean
function forgetNarrowings(): void {
  searchTerm.value = ''
  selectedTag.value = undefined
}

const results = computed(
  () => filterCatalog(props.catalog, searchTerm.value, selectedTag.value),
)

function choose(offer: CatalogOfferPayload) {
  emit('choose', offer)
  isOpen.value = false
}
</script>

<style lang="scss" scoped>
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;
@use '../../styles/screen';

.key-moments-offers-picker {
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

  &__chosen {
    opacity: 0.7;
  }
}
</style>
