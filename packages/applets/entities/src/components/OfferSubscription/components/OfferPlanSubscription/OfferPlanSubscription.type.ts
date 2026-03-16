import type { Ref } from 'vue'
import type { OfferPlan } from '@entities/types'

export interface OfferPlanSubscriptionProps {
  selectedPlanId?: number,
  plans: OfferPlan[]
  isRecap?: boolean
}

export interface UseOfferPlanSubscriptionParams {
  plans: Ref<OfferPlan[]>
  isRecap: Ref<boolean>
  selectedPlanId: Ref<number | undefined>
  selectedPricingId: Ref<number | undefined>
}
