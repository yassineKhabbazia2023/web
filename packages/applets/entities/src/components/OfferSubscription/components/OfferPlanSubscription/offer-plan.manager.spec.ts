import { OfferPlanManager } from './offer-plan.manager'
import { getOfferPlanMock } from '@entities/__mocks__/offer-subscription.mocks'
import type { OfferPlan } from '@entities/types'

describe('OfferPlanManager', () => {
  describe('getDefaultSelectedPlan', () => {
    it('should return default plan ID when a default plan exists', () => {
      const plans: OfferPlan[] = [
        getOfferPlanMock({ planId: 1, planCode: 'BASIC', planName: 'Basique', isDefault: false }),
        getOfferPlanMock({ planId: 2, planCode: 'ESSENTIAL', planName: 'Essentiel', isDefault: true }),
        getOfferPlanMock({ planId: 3, planCode: 'PREMIUM', planName: 'Premium', isDefault: false }),
      ]

      const result = OfferPlanManager.getDefaultSelectedPlan(plans)

      expect(result).toBe(2)
    })

    it('should return first plan ID when no default exists', () => {
      const plans: OfferPlan[] = [
        getOfferPlanMock({ planId: 1, planCode: 'BASIC', planName: 'Basique', isDefault: false }),
        getOfferPlanMock({ planId: 2, planCode: 'PREMIUM', planName: 'Premium', isDefault: false }),
      ]

      const result = OfferPlanManager.getDefaultSelectedPlan(plans)

      expect(result).toBe(1)
    })

    it('should return undefined for empty plans array', () => {
      const result = OfferPlanManager.getDefaultSelectedPlan([])

      expect(result).toBeUndefined()
    })

    it('should return first default when multiple defaults exist', () => {
      const plans: OfferPlan[] = [
        getOfferPlanMock({ planId: 1, planCode: 'BASIC', planName: 'Basique', isDefault: true }),
        getOfferPlanMock({ planId: 2, planCode: 'PREMIUM', planName: 'Premium', isDefault: true }),
      ]

      const result = OfferPlanManager.getDefaultSelectedPlan(plans)

      // find() returns first match
      expect(result).toBe(1)
    })

    it('should return single plan ID when it is marked as default', () => {
      const plans: OfferPlan[] = [
        getOfferPlanMock({ planId: 99, planCode: 'UNIQUE', planName: 'Unique Plan', isDefault: true }),
      ]

      const result = OfferPlanManager.getDefaultSelectedPlan(plans)

      expect(result).toBe(99)
    })

    it('should return single plan ID when it is not marked as default', () => {
      const plans: OfferPlan[] = [
        getOfferPlanMock({ planId: 50, planCode: 'SOLO', planName: 'Solo Plan', isDefault: false }),
      ]

      const result = OfferPlanManager.getDefaultSelectedPlan(plans)

      // Should fallback to first (and only) plan
      expect(result).toBe(50)
    })
  })
})
