import { computed, ref, toValue } from 'vue'
import { toggled } from '@key-moments/utils/set.utils'
import type { RecommendationOffersSelectionOptions } from './recommendation-offers-picker.types'

/** A multiple selection that lives only while the picker is open. */
export function useRecommendationOffersSelection(options: RecommendationOffersSelectionOptions) {
  const selectedOfferIds = ref(new Set<number>())

  const selectedCount = computed(() => selectedOfferIds.value.size)

  function isSelected(offerId: number): boolean {
    return selectedOfferIds.value.has(offerId)
  }

  function toggleOffer(offerId: number): void {
    selectedOfferIds.value = toggled(selectedOfferIds.value, offerId)
  }

  /** Every opening starts from what is attached, whatever a previous opening left. */
  function reset(): void {
    selectedOfferIds.value = new Set(toValue(options.initialSelection))
  }

  /** The order emitted is the catalogue's, never the order of the clicks. */
  function validateSelection(): void {
    const ordered = toValue(options.catalog)
      .map(offer => offer.id)
      .filter(offerId => selectedOfferIds.value.has(offerId))

    options.onValidate(ordered)
  }

  return {
    selectedCount,
    isSelected,
    toggleOffer,
    reset,
    validateSelection,
  }
}
