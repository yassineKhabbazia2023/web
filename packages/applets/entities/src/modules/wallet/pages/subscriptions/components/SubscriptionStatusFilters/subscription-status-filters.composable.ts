import type { Ref } from 'vue'
import { computed } from 'vue'
import type { FilterOption } from '@pulse/styleguide/types'
import { SubscriptionStatusCode } from '@entities/services/subscription/subscriptionTypes'
import { SubscriptionStatusFiltersManager } from './subscription-status-filters.manager'

interface UseSubscriptionStatusFiltersParams {
  activeStatusCodes: Ref<SubscriptionStatusCode[]>
  offerActivationFilters: Ref<FilterOption<SubscriptionStatusCode>[]>
  validatedFilters: Ref<FilterOption<SubscriptionStatusCode>[]>
}

export function useSubscriptionStatusFilters({
  activeStatusCodes,
  offerActivationFilters,
  validatedFilters,
}: UseSubscriptionStatusFiltersParams) {
  const isValidatedSelected = computed(() =>
    activeStatusCodes.value.includes(SubscriptionStatusCode.VALIDATED),
  )

  const styledOfferActivationFilters = computed(() =>
    offerActivationFilters.value.map(filter => ({
      ...filter,
      pColor: isValidatedSelected.value ? 'gray' as const : filter.pColor,
    })),
  )

  const styledValidatedFilters = computed(() =>
    validatedFilters.value.map(filter => ({
      ...filter,
      pColor: isValidatedSelected.value ? 'success' as const : filter.pColor,
    })),
  )

  const standardCodesModel = computed({
    get: () => activeStatusCodes.value.filter(code => code !== SubscriptionStatusCode.VALIDATED),
    set: (newCodes: SubscriptionStatusCode[]) => {
      activeStatusCodes.value = newCodes
    },
  })

  const validatedCodesModel = computed({
    get: () =>
      activeStatusCodes.value.includes(SubscriptionStatusCode.VALIDATED)
        ? [SubscriptionStatusCode.VALIDATED]
        : [],
    set: (newCodes: SubscriptionStatusCode[]) => {
      activeStatusCodes.value = newCodes.includes(SubscriptionStatusCode.VALIDATED)
        ? SubscriptionStatusFiltersManager.getActiveCodesOnValidatedSelected()
        : SubscriptionStatusFiltersManager.getActiveCodesOnValidatedDeselected()
    },
  })

  return {
    standardCodesModel,
    validatedCodesModel,
    styledOfferActivationFilters,
    styledValidatedFilters,
  }
}
