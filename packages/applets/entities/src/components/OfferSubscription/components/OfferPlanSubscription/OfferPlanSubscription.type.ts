import type { OfferPlan } from '@entities/types'

export interface OfferPlanSubscriptionProps {
  selectedPlanId?: number,
  plans: OfferPlan[]
  isRecap?: boolean
}
