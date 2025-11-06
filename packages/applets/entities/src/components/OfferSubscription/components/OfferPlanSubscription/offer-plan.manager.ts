import type { OfferPlan } from '@entities/types'

/**
 * Manager responsible for offer plan selection logic
 */
export class OfferPlanManager {
  /**
   * Determines the default plan ID to select from a list of plans
   * @param plans - Array of available offer plans
   * @returns The planId to select, or undefined if no plans are available
   */
  static getDefaultSelectedPlan(plans: OfferPlan[]): number | undefined {
    // Guard: handle empty plans array
    if (plans.length === 0) {
      return undefined
    }

    // Try to select default plan
    const defaultPlan = plans.find(plan => plan.isDefault === true)
    if (defaultPlan !== undefined) {
      return defaultPlan.planId
    }

    // Fallback: select first plan if no default exists
    return plans[0].planId
  }
}
