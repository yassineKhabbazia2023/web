import { SubscriptionStatusCode } from '@entities/services/subscription/subscriptionTypes'
import type { SubscriptionStats } from '@entities/services/subscription/subscriptionTypes'
import { SubscriptionStatusFiltersManager } from './subscription-status-filters.manager'

vi.mock('@pulse/common/i18n', () => ({
  i18n: {
    global: {
      t: (key: string) => key,
    },
  },
}))

const statsMock: SubscriptionStats = {
  statuses: {
    [SubscriptionStatusCode.PENDING]: 3,
    [SubscriptionStatusCode.PENNYLANE_TO_VERIFY]: 1,
    [SubscriptionStatusCode.PENNYLANE_CREATED]: 2,
    [SubscriptionStatusCode.VALIDATED]: 6,
  },
}

describe('SubscriptionStatusFiltersManager', () => {
  describe('getDefaultActiveStatusCodes', () => {
    it('should return the 3 standard status codes: PENDING, PENNYLANE_TO_VERIFY, PENNYLANE_CREATED', () => {
      const codes = SubscriptionStatusFiltersManager.getDefaultActiveStatusCodes()

      expect(codes).toHaveLength(3)
      expect(codes).toEqual([
        SubscriptionStatusCode.PENDING,
        SubscriptionStatusCode.PENNYLANE_TO_VERIFY,
        SubscriptionStatusCode.PENNYLANE_CREATED,
      ])
    })
  })

  describe('getOfferActivationFilters', () => {
    it('should return 3 filters in the correct order: PENDING, PENNYLANE_TO_VERIFY, PENNYLANE_CREATED', () => {
      const filters = SubscriptionStatusFiltersManager.getOfferActivationFilters(statsMock)

      expect(filters).toHaveLength(3)
      expect(filters[0].pCode).toBe(SubscriptionStatusCode.PENDING)
      expect(filters[1].pCode).toBe(SubscriptionStatusCode.PENNYLANE_TO_VERIFY)
      expect(filters[2].pCode).toBe(SubscriptionStatusCode.PENNYLANE_CREATED)
    })

    it('should use the correct i18n labels', () => {
      const filters = SubscriptionStatusFiltersManager.getOfferActivationFilters(statsMock)

      expect(filters[0].pContent).toBe('entities.wallet.subscriptionStatusFilters.toCreate')
      expect(filters[1].pContent).toBe('entities.wallet.subscriptionStatusFilters.toVerify')
      expect(filters[2].pContent).toBe('entities.wallet.subscriptionStatusFilters.created')
    })

    it('should use the correct counts from stats', () => {
      const filters = SubscriptionStatusFiltersManager.getOfferActivationFilters(statsMock)

      expect(filters[0].pValue).toBe(3)
      expect(filters[1].pValue).toBe(1)
      expect(filters[2].pValue).toBe(2)
    })

    it('should set all filters as not disabled', () => {
      const filters = SubscriptionStatusFiltersManager.getOfferActivationFilters(statsMock)

      filters.forEach((filter) => {
        expect(filter.pDisabled).toBe(false)
      })
    })

    it('should default counts to 0 when statuses is empty', () => {
      const filters = SubscriptionStatusFiltersManager.getOfferActivationFilters({ statuses: {} })

      filters.forEach((filter) => {
        expect(filter.pValue).toBe(0)
      })
    })

    it('should default counts to 0 when a status is missing from stats', () => {
      const partialStats: SubscriptionStats = {
        statuses: {
          [SubscriptionStatusCode.PENDING]: 5,
        },
      }

      const filters = SubscriptionStatusFiltersManager.getOfferActivationFilters(partialStats)

      expect(filters[0].pValue).toBe(5)
      expect(filters[1].pValue).toBe(0)
      expect(filters[2].pValue).toBe(0)
    })
  })

  describe('getActiveCodesOnValidatedSelected', () => {
    it('should return only VALIDATED status code', () => {
      const codes = SubscriptionStatusFiltersManager.getActiveCodesOnValidatedSelected()

      expect(codes).toHaveLength(1)
      expect(codes).toEqual([SubscriptionStatusCode.VALIDATED])
    })
  })

  describe('getActiveCodesOnValidatedDeselected', () => {
    it('should return the same codes as getDefaultActiveStatusCodes', () => {
      const codes = SubscriptionStatusFiltersManager.getActiveCodesOnValidatedDeselected()

      expect(codes).toHaveLength(3)
      expect(codes).toEqual([
        SubscriptionStatusCode.PENDING,
        SubscriptionStatusCode.PENNYLANE_TO_VERIFY,
        SubscriptionStatusCode.PENNYLANE_CREATED,
      ])
    })
  })

  describe('getValidatedFilters', () => {
    it('should return 1 filter for VALIDATED status', () => {
      const filters = SubscriptionStatusFiltersManager.getValidatedFilters(statsMock)

      expect(filters).toHaveLength(1)
      expect(filters[0].pCode).toBe(SubscriptionStatusCode.VALIDATED)
    })

    it('should use the correct i18n label and count', () => {
      const filters = SubscriptionStatusFiltersManager.getValidatedFilters(statsMock)

      expect(filters[0].pContent).toBe('entities.wallet.subscriptionStatusFilters.validated')
      expect(filters[0].pValue).toBe(6)
    })

    it('should set the filter as not disabled', () => {
      const filters = SubscriptionStatusFiltersManager.getValidatedFilters(statsMock)

      expect(filters[0].pDisabled).toBe(false)
    })

    it('should default count to 0 when statuses is empty', () => {
      const filters = SubscriptionStatusFiltersManager.getValidatedFilters({ statuses: {} })

      expect(filters[0].pValue).toBe(0)
    })
  })
})
