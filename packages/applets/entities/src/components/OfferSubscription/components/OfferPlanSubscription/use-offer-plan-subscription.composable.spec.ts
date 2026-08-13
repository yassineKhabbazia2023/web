import { ref } from 'vue'
import { withSetup } from '@pulse/toolbox/utils/test'
import { useOfferPlanSubscription } from './use-offer-plan-subscription.composable'
import { getOfferPlanMock } from '@entities/__mocks__/offer-subscription.mocks'
import type { OfferPlan } from '@entities/types'
import { PlanCode } from '@entities/enums'

const PLAN_BASIC = getOfferPlanMock({
  planId: 1,
  planCode: PlanCode.BASIC,
  planName: 'Basique',
  pricings: [
    { planPricingId: 1, price: 14, priceType: 'mois HT', label: '1 utilisateur' },
  ],
})

const PLAN_ESSENTIAL = getOfferPlanMock({
  planId: 2,
  planCode: PlanCode.ESSENTIAL,
  planName: 'Essentiel',
  pricings: [
    { planPricingId: 2, price: 24, priceType: 'mois HT', label: '1 utilisateur' },
    { planPricingId: 3, price: 49, priceType: 'mois HT', label: '5 utilisateurs' },
  ],
})

const PLAN_PREMIUM_INTERNAL = getOfferPlanMock({
  planId: 3,
  planCode: PlanCode.PREMIUM_INTERNAL,
  planName: 'Premium internalisé',
  pricings: [
    { planPricingId: 4, price: 79, priceType: 'mois HT', label: '1 utilisateur' },
    { planPricingId: 5, price: 149, priceType: 'mois HT', label: '5 utilisateurs' },
    { planPricingId: 6, price: 298, priceType: 'mois HT', label: '10 utilisateurs' },
  ],
})

const DEFAULT_PLANS: OfferPlan[] = [PLAN_BASIC, PLAN_ESSENTIAL, PLAN_PREMIUM_INTERNAL]

describe('useOfferPlanSubscription', () => {
  describe('selectedPlanPricings', () => {
    it('should return pricings of selected plan in creation mode', () => {
      const [{ selectedPlanPricings }] = withSetup(() => useOfferPlanSubscription({
        plans: ref(DEFAULT_PLANS),
        isRecap: ref(false),
        selectedPlanId: ref(2),
        selectedPricingId: ref(undefined),
      }))

      expect(selectedPlanPricings.value).toHaveLength(2)
      expect(selectedPlanPricings.value[0].planPricingId).toBe(2)
    })

    it('should return pricings of plan with isSelected=true in recap mode', () => {
      const plansWithSelection = [
        { ...PLAN_BASIC, isSelected: false },
        { ...PLAN_ESSENTIAL, isSelected: true },
        { ...PLAN_PREMIUM_INTERNAL, isSelected: false },
      ]

      const [{ selectedPlanPricings }] = withSetup(() => useOfferPlanSubscription({
        plans: ref(plansWithSelection),
        isRecap: ref(true),
        selectedPlanId: ref(1), // ignored in recap mode
        selectedPricingId: ref(undefined),
      }))

      expect(selectedPlanPricings.value).toHaveLength(2)
      expect(selectedPlanPricings.value[0].planPricingId).toBe(2)
    })

    it('should return empty array when no plan is selected', () => {
      const [{ selectedPlanPricings }] = withSetup(() => useOfferPlanSubscription({
        plans: ref(DEFAULT_PLANS),
        isRecap: ref(false),
        selectedPlanId: ref(undefined),
        selectedPricingId: ref(undefined),
      }))

      expect(selectedPlanPricings.value).toHaveLength(0)
    })
  })

  describe('pricingGridClass', () => {
    it.each([
      { planId: 1, expectedClass: 'grid-cols--1', description: '1 pricing' },
      { planId: 2, expectedClass: 'grid-cols--2', description: '2 pricings' },
      { planId: 3, expectedClass: 'grid-cols--3', description: '3 pricings' },
      { planId: undefined, expectedClass: 'grid-cols--3', description: 'no plan selected' },
    ])('should return $expectedClass when $description', ({ planId, expectedClass }) => {
      const [{ pricingGridClass }] = withSetup(() => useOfferPlanSubscription({
        plans: ref(DEFAULT_PLANS),
        isRecap: ref(false),
        selectedPlanId: ref(planId),
        selectedPricingId: ref(undefined),
      }))

      expect(pricingGridClass.value).toBe(expectedClass)
    })
  })

  describe('initializeRecapMode', () => {
    it('should set selectedPlanId and selectedPricingId from API data', () => {
      const plansWithSelection = [
        { ...PLAN_BASIC, isSelected: false },
        {
          ...PLAN_ESSENTIAL,
          isSelected: true,
          pricings: [
            { planPricingId: 2, price: 24, priceType: 'mois HT', label: '1 utilisateur', isSelected: false },
            { planPricingId: 3, price: 49, priceType: 'mois HT', label: '5 utilisateurs', isSelected: true },
          ],
        },
        { ...PLAN_PREMIUM_INTERNAL, isSelected: false },
      ]
      const selectedPlanId = ref<number | undefined>(undefined)
      const selectedPricingId = ref<number | undefined>(undefined)

      const [{ initializeRecapMode }] = withSetup(() => useOfferPlanSubscription({
        plans: ref(plansWithSelection),
        isRecap: ref(true),
        selectedPlanId,
        selectedPricingId,
      }))

      initializeRecapMode()

      expect(selectedPlanId.value).toBe(2)
      expect(selectedPricingId.value).toBe(3)
    })

    it('should not modify values when isRecap is false', () => {
      const plansWithSelection = [{ ...PLAN_BASIC, isSelected: true }]
      const selectedPlanId = ref<number | undefined>(undefined)
      const selectedPricingId = ref<number | undefined>(undefined)

      const [{ initializeRecapMode }] = withSetup(() => useOfferPlanSubscription({
        plans: ref(plansWithSelection),
        isRecap: ref(false),
        selectedPlanId,
        selectedPricingId,
      }))

      initializeRecapMode()

      expect(selectedPlanId.value).toBeUndefined()
      expect(selectedPricingId.value).toBeUndefined()
    })

    it('should set planId but not pricingId when selected plan has undefined pricings', () => {
      const plansWithSelection = [
        {
          ...PLAN_BASIC,
          isSelected: true,
          pricings: undefined,
        },
      ]
      const selectedPlanId = ref<number | undefined>(undefined)
      const selectedPricingId = ref<number | undefined>(undefined)

      const [{ initializeRecapMode }] = withSetup(() => useOfferPlanSubscription({
        plans: ref(plansWithSelection),
        isRecap: ref(true),
        selectedPlanId,
        selectedPricingId,
      }))

      initializeRecapMode()

      expect(selectedPlanId.value).toBe(1)
      expect(selectedPricingId.value).toBeUndefined()
    })

    it('should set planId but not pricingId when selected plan has empty pricings array', () => {
      const plansWithSelection = [
        {
          ...PLAN_BASIC,
          isSelected: true,
          pricings: [],
        },
      ]
      const selectedPlanId = ref<number | undefined>(undefined)
      const selectedPricingId = ref<number | undefined>(undefined)

      const [{ initializeRecapMode }] = withSetup(() => useOfferPlanSubscription({
        plans: ref(plansWithSelection),
        isRecap: ref(true),
        selectedPlanId,
        selectedPricingId,
      }))

      initializeRecapMode()

      expect(selectedPlanId.value).toBe(1)
      expect(selectedPricingId.value).toBeUndefined()
    })
  })

  describe('handlePlanChange', () => {
    it('should auto-select pricing when plan has exactly 1 pricing', () => {
      const selectedPricingId = ref<number | undefined>(undefined)

      const [{ handlePlanChange }] = withSetup(() => useOfferPlanSubscription({
        plans: ref(DEFAULT_PLANS),
        isRecap: ref(false),
        selectedPlanId: ref(undefined),
        selectedPricingId,
      }))

      handlePlanChange(1) // PLAN_BASIC has 1 pricing

      expect(selectedPricingId.value).toBe(1)
    })

    it('should clear pricing when plan has multiple pricings', () => {
      const selectedPricingId = ref<number | undefined>(999)

      const [{ handlePlanChange }] = withSetup(() => useOfferPlanSubscription({
        plans: ref(DEFAULT_PLANS),
        isRecap: ref(false),
        selectedPlanId: ref(undefined),
        selectedPricingId,
      }))

      handlePlanChange(2) // PLAN_ESSENTIAL has 2 pricings

      expect(selectedPricingId.value).toBeUndefined()
    })

    it('should not modify pricing in recap mode', () => {
      const selectedPricingId = ref<number | undefined>(1)

      const [{ handlePlanChange }] = withSetup(() => useOfferPlanSubscription({
        plans: ref(DEFAULT_PLANS),
        isRecap: ref(true),
        selectedPlanId: ref(1),
        selectedPricingId,
      }))

      handlePlanChange(2)

      expect(selectedPricingId.value).toBe(1)
    })

    it('should clear pricing when plan has undefined pricings', () => {
      const plansWithUndefinedPricings = [
        {
          ...PLAN_BASIC,
          pricings: undefined,
        },
      ]
      const selectedPricingId = ref<number | undefined>(999)

      const [{ handlePlanChange }] = withSetup(() => useOfferPlanSubscription({
        plans: ref(plansWithUndefinedPricings),
        isRecap: ref(false),
        selectedPlanId: ref(undefined),
        selectedPricingId,
      }))

      handlePlanChange(1)

      expect(selectedPricingId.value).toBeUndefined()
    })

    it('should clear pricing when plan has empty pricings array', () => {
      const plansWithEmptyPricings = [
        {
          ...PLAN_BASIC,
          pricings: [],
        },
      ]
      const selectedPricingId = ref<number | undefined>(999)

      const [{ handlePlanChange }] = withSetup(() => useOfferPlanSubscription({
        plans: ref(plansWithEmptyPricings),
        isRecap: ref(false),
        selectedPlanId: ref(undefined),
        selectedPricingId,
      }))

      handlePlanChange(1)

      expect(selectedPricingId.value).toBeUndefined()
    })
  })
})
