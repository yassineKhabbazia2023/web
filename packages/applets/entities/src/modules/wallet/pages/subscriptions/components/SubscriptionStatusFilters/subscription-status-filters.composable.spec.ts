import { ref } from 'vue'
import type { FilterOption } from '@pulse/styleguide/types'
import { SubscriptionStatusCode } from '@entities/services/subscription/subscriptionTypes'
import { useSubscriptionStatusFilters } from './subscription-status-filters.composable'

const defaultOfferActivationFilters: FilterOption<SubscriptionStatusCode>[] = [
  { pCode: SubscriptionStatusCode.PENDING, pContent: 'toCreate', pValue: 3, pColor: 'warning', pIconName: 'arrowUpCircle', pDisabled: false },
  { pCode: SubscriptionStatusCode.PENNYLANE_TO_VERIFY, pContent: 'toVerify', pValue: 1, pColor: 'light-blue', pIconName: 'search', pDisabled: false },
  { pCode: SubscriptionStatusCode.PENNYLANE_CREATED, pContent: 'created', pValue: 2, pColor: 'purple', pIconName: 'arrowRepeat', pDisabled: false },
]

const defaultValidatedFilters: FilterOption<SubscriptionStatusCode>[] = [
  { pCode: SubscriptionStatusCode.VALIDATED, pContent: 'validated', pValue: 6, pColor: 'gray', pIconName: 'checkCircle', pDisabled: false },
]

function setupComposable(initialCodes: SubscriptionStatusCode[]) {
  const activeStatusCodes = ref(initialCodes)
  const offerActivationFilters = ref(defaultOfferActivationFilters)
  const validatedFilters = ref(defaultValidatedFilters)

  return {
    activeStatusCodes,
    ...useSubscriptionStatusFilters({ activeStatusCodes, offerActivationFilters, validatedFilters }),
  }
}

describe('useSubscriptionStatusFilters', () => {
  describe('standardCodesModel', () => {
    it('should return only non-VALIDATED codes from activeStatusCodes', () => {
      const { standardCodesModel } = setupComposable([
        SubscriptionStatusCode.PENDING,
        SubscriptionStatusCode.PENNYLANE_TO_VERIFY,
      ])

      expect(standardCodesModel.value).toEqual([
        SubscriptionStatusCode.PENDING,
        SubscriptionStatusCode.PENNYLANE_TO_VERIFY,
      ])
    })

    it('should exclude VALIDATED from the result', () => {
      const { standardCodesModel } = setupComposable([SubscriptionStatusCode.VALIDATED])

      expect(standardCodesModel.value).toEqual([])
    })
  })

  describe('validatedCodesModel', () => {
    it('should return [VALIDATED] when activeStatusCodes includes VALIDATED', () => {
      const { validatedCodesModel } = setupComposable([SubscriptionStatusCode.VALIDATED])

      expect(validatedCodesModel.value).toEqual([SubscriptionStatusCode.VALIDATED])
    })

    it('should return empty array when activeStatusCodes does not include VALIDATED', () => {
      const { validatedCodesModel } = setupComposable([
        SubscriptionStatusCode.PENDING,
        SubscriptionStatusCode.PENNYLANE_CREATED,
      ])

      expect(validatedCodesModel.value).toEqual([])
    })
  })

  describe('standardCodesModel set', () => {
    it('should set activeStatusCodes to the provided codes', () => {
      const { standardCodesModel, activeStatusCodes } = setupComposable([SubscriptionStatusCode.VALIDATED])
      standardCodesModel.value = [SubscriptionStatusCode.PENDING]

      expect(activeStatusCodes.value).toEqual([SubscriptionStatusCode.PENDING])
    })
  })

  describe('validatedCodesModel set', () => {
    it('should set only VALIDATED when setting a value that includes VALIDATED', () => {
      const { validatedCodesModel, activeStatusCodes } = setupComposable([
        SubscriptionStatusCode.PENDING,
        SubscriptionStatusCode.PENNYLANE_TO_VERIFY,
        SubscriptionStatusCode.PENNYLANE_CREATED,
      ])
      validatedCodesModel.value = [SubscriptionStatusCode.VALIDATED]

      expect(activeStatusCodes.value).toEqual([SubscriptionStatusCode.VALIDATED])
    })

    it('should restore default codes when setting a value without VALIDATED', () => {
      const { validatedCodesModel, activeStatusCodes } = setupComposable([SubscriptionStatusCode.VALIDATED])
      validatedCodesModel.value = []

      expect(activeStatusCodes.value).toEqual([
        SubscriptionStatusCode.PENDING,
        SubscriptionStatusCode.PENNYLANE_TO_VERIFY,
        SubscriptionStatusCode.PENNYLANE_CREATED,
      ])
    })
  })

  describe('styledOfferActivationFilters', () => {
    it('should keep original colors when VALIDATED is not selected', () => {
      const { styledOfferActivationFilters } = setupComposable([
        SubscriptionStatusCode.PENDING,
        SubscriptionStatusCode.PENNYLANE_TO_VERIFY,
      ])

      expect(styledOfferActivationFilters.value[0].pColor).toBe('warning')
      expect(styledOfferActivationFilters.value[1].pColor).toBe('light-blue')
      expect(styledOfferActivationFilters.value[2].pColor).toBe('purple')
    })

    it('should set all colors to gray when VALIDATED is selected', () => {
      const { styledOfferActivationFilters } = setupComposable([SubscriptionStatusCode.VALIDATED])

      styledOfferActivationFilters.value.forEach(filter => {
        expect(filter.pColor).toBe('gray')
      })
    })
  })

  describe('styledValidatedFilters', () => {
    it('should keep gray color when VALIDATED is not selected', () => {
      const { styledValidatedFilters } = setupComposable([SubscriptionStatusCode.PENDING])

      expect(styledValidatedFilters.value[0].pColor).toBe('gray')
    })

    it('should set color to success when VALIDATED is selected', () => {
      const { styledValidatedFilters } = setupComposable([SubscriptionStatusCode.VALIDATED])

      expect(styledValidatedFilters.value[0].pColor).toBe('success')
    })
  })
})
