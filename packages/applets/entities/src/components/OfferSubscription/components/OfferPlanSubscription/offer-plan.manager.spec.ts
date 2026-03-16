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

  describe('getSelectedPlan', () => {
    it('should return the selected plan when one exists', () => {
      const plans: OfferPlan[] = [
        getOfferPlanMock({ planId: 1, planCode: 'BASIC', planName: 'Basique', isSelected: false }),
        getOfferPlanMock({ planId: 2, planCode: 'ESSENTIAL', planName: 'Essentiel', isSelected: true }),
        getOfferPlanMock({ planId: 3, planCode: 'PREMIUM', planName: 'Premium', isSelected: false }),
      ]

      const result = OfferPlanManager.getSelectedPlan(plans)

      expect(result).toEqual(plans[1])
      expect(result?.planId).toBe(2)
    })

    it('should return undefined when no plan is selected', () => {
      const plans: OfferPlan[] = [
        getOfferPlanMock({ planId: 1, planCode: 'BASIC', planName: 'Basique', isSelected: false }),
        getOfferPlanMock({ planId: 2, planCode: 'ESSENTIAL', planName: 'Essentiel', isSelected: false }),
      ]

      const result = OfferPlanManager.getSelectedPlan(plans)

      expect(result).toBeUndefined()
    })

    it('should return undefined when plans array is empty', () => {
      const result = OfferPlanManager.getSelectedPlan([])

      expect(result).toBeUndefined()
    })

    it('should return undefined when plans is undefined', () => {
      const result = OfferPlanManager.getSelectedPlan(undefined)

      expect(result).toBeUndefined()
    })

    it('should return first selected plan when multiple plans are selected', () => {
      const plans: OfferPlan[] = [
        getOfferPlanMock({ planId: 1, planCode: 'BASIC', planName: 'Basique', isSelected: true }),
        getOfferPlanMock({ planId: 2, planCode: 'ESSENTIAL', planName: 'Essentiel', isSelected: true }),
      ]

      const result = OfferPlanManager.getSelectedPlan(plans)

      expect(result?.planId).toBe(1)
    })

    it('should return the plan when it is the only one and selected', () => {
      const plans: OfferPlan[] = [
        getOfferPlanMock({ planId: 99, planCode: 'UNIQUE', planName: 'Unique Plan', isSelected: true }),
      ]

      const result = OfferPlanManager.getSelectedPlan(plans)

      expect(result?.planId).toBe(99)
    })

    it('should handle plans with isSelected explicitly false', () => {
      const plans: OfferPlan[] = [
        getOfferPlanMock({ planId: 1, planCode: 'BASIC', planName: 'Basique', isSelected: false }),
      ]

      const result = OfferPlanManager.getSelectedPlan(plans)

      expect(result).toBeUndefined()
    })

    it('should handle plans without isSelected property', () => {
      const plans: OfferPlan[] = [
        getOfferPlanMock({ planId: 1, planCode: 'BASIC', planName: 'Basique' }),
      ]

      const result = OfferPlanManager.getSelectedPlan(plans)

      expect(result).toBeUndefined()
    })
  })

  describe('getPlanName', () => {
    const plans: OfferPlan[] = [
      getOfferPlanMock({ planId: 1, planCode: 'BASIC', planName: 'Basique', isDefault: false }),
      getOfferPlanMock({ planId: 2, planCode: 'ESSENTIAL', planName: 'Essentiel', isDefault: true }),
      getOfferPlanMock({ planId: 3, planCode: 'PREMIUM', planName: 'Premium', isDefault: false }),
    ]

    it.each([
      { planId: 1, expected: 'Basique', description: 'first plan' },
      { planId: 2, expected: 'Essentiel', description: 'plan ID exists' },
      { planId: 3, expected: 'Premium', description: 'last plan' },
    ])('should return $expected when $description (planId: $planId)', ({ planId, expected }) => {
      const result = OfferPlanManager.getPlanName(planId, plans)

      expect(result).toBe(expected)
    })

    it.each([
      { planId: 999, plans, description: 'plan ID does not exist' },
      { planId: undefined, plans, description: 'planId is undefined' },
      { planId: 1, plans: [], description: 'plans array is empty' },
      { planId: 1, plans: undefined, description: 'plans is undefined' },
    ])('should return undefined when $description', ({ planId, plans }) => {
      const result = OfferPlanManager.getPlanName(planId, plans)

      expect(result).toBeUndefined()
    })
  })

  describe('getPricingLabel', () => {
    const plans: OfferPlan[] = [
      getOfferPlanMock({
        planId: 1,
        planCode: 'BASIC',
        planName: 'Basique',
        pricings: [
          { planPricingId: 1, price: 14, priceType: 'mois HT', label: '1 utilisateur' },
          { planPricingId: 2, price: 29, priceType: 'mois HT', label: '5 utilisateurs' },
        ],
      }),
      getOfferPlanMock({
        planId: 2,
        planCode: 'PREMIUM',
        planName: 'Premium',
        pricings: [
          { planPricingId: 3, price: 49, priceType: 'mois HT', label: '1 utilisateur' },
        ],
      }),
    ]

    it('should return pricing label when pricing exists in plan', () => {
      const result = OfferPlanManager.getPricingLabel(1, 1, plans)

      expect(result).toBe('1 utilisateur')
    })

    it('should return correct pricing label for different pricing in same plan', () => {
      const result = OfferPlanManager.getPricingLabel(2, 1, plans)

      expect(result).toBe('5 utilisateurs')
    })

    it('should return pricing label from different plan', () => {
      const result = OfferPlanManager.getPricingLabel(3, 2, plans)

      expect(result).toBe('1 utilisateur')
    })

    it('should return undefined when pricingId does not exist in plan', () => {
      const result = OfferPlanManager.getPricingLabel(999, 1, plans)

      expect(result).toBeUndefined()
    })

    it('should return undefined when planId does not exist', () => {
      const result = OfferPlanManager.getPricingLabel(1, 999, plans)

      expect(result).toBeUndefined()
    })

    it('should return undefined when plans is empty', () => {
      const result = OfferPlanManager.getPricingLabel(1, 1, [])

      expect(result).toBeUndefined()
    })
  })

  describe('getSelectedPricing', () => {
    it('should return selected pricing when one exists', () => {
      const plans: OfferPlan[] = [
        getOfferPlanMock({
          planId: 1,
          isSelected: true,
          pricings: [
            { planPricingId: 1, price: 14, priceType: 'mois HT', label: '1 utilisateur', isSelected: false },
            { planPricingId: 2, price: 29, priceType: 'mois HT', label: '5 utilisateurs', isSelected: true },
          ],
        }),
      ]

      const result = OfferPlanManager.getSelectedPricing(plans)

      expect(result).toEqual({ planPricingId: 2, price: 29, priceType: 'mois HT', label: '5 utilisateurs', isSelected: true })
    })

    it('should return undefined when no pricing is selected in selected plan', () => {
      const plans: OfferPlan[] = [
        getOfferPlanMock({
          planId: 1,
          isSelected: true,
          pricings: [
            { planPricingId: 1, price: 14, priceType: 'mois HT', label: '1 utilisateur', isSelected: false },
          ],
        }),
      ]

      const result = OfferPlanManager.getSelectedPricing(plans)

      expect(result).toBeUndefined()
    })

    it('should return undefined when no plan is selected', () => {
      const plans: OfferPlan[] = [
        getOfferPlanMock({
          planId: 1,
          isSelected: false,
          pricings: [
            { planPricingId: 1, price: 14, priceType: 'mois HT', label: '1 utilisateur', isSelected: true },
          ],
        }),
      ]

      const result = OfferPlanManager.getSelectedPricing(plans)

      expect(result).toBeUndefined()
    })

    it('should return undefined when plans is undefined', () => {
      const result = OfferPlanManager.getSelectedPricing(undefined)

      expect(result).toBeUndefined()
    })

    it('should return undefined when plans is empty', () => {
      const result = OfferPlanManager.getSelectedPricing([])

      expect(result).toBeUndefined()
    })

    it('should return pricing from the selected plan only', () => {
      const plans: OfferPlan[] = [
        getOfferPlanMock({
          planId: 1,
          isSelected: false,
          pricings: [
            { planPricingId: 1, price: 14, priceType: 'mois HT', label: 'Wrong pricing', isSelected: true },
          ],
        }),
        getOfferPlanMock({
          planId: 2,
          isSelected: true,
          pricings: [
            { planPricingId: 2, price: 49, priceType: 'mois HT', label: 'Correct pricing', isSelected: true },
          ],
        }),
      ]

      const result = OfferPlanManager.getSelectedPricing(plans)

      expect(result?.label).toBe('Correct pricing')
      expect(result?.planPricingId).toBe(2)
    })
  })
})
