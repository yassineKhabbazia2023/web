import type { OfferPlan, OfferPlanPricing } from '@entities/types'

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

  /**
   * Finds the selected plan from an array of plans
   *
   * @param plans - Array of available offer plans (can be undefined for offers without plans)
   * @returns The selected plan (where isSelected === true), or undefined if no plan is selected or plans is empty/undefined
   */
  static getSelectedPlan(plans: OfferPlan[] | undefined): OfferPlan | undefined {
    if (plans === undefined || plans.length === 0) {
      return undefined
    }

    return plans.find(plan => plan.isSelected === true)
  }

  /**
   * Retrieves the plan name for a given plan ID
   *
   * @param planId - The plan ID to look up
   * @param plans - Array of available offer plans (can be undefined for offers without plans)
   * @returns The plan name if found, or undefined if not found or planId is undefined
   */
  static getPlanName(planId: number | undefined, plans: OfferPlan[] | undefined): string | undefined {
    if (planId === undefined || plans === undefined || plans.length === 0) {
      return undefined
    }

    const plan = plans.find(p => p.planId === planId)
    return plan?.planName
  }

  /**
   * Retrieves the pricing label for a given pricing ID within a plan
   *
   * @param pricingId - The pricing ID to look up
   * @param planId - The plan ID containing the pricing
   * @param plans - Array of available offer plans
   * @returns The pricing label if found, or undefined if not found
   */
  static getPricingLabel(pricingId: number, planId: number, plans: OfferPlan[]): string | undefined {
    const plan = plans.find(p => p.planId === planId)
    if (plan === undefined || plan.pricings === undefined || plan.pricings.length === 0) {
      return undefined
    }

    const pricing = plan.pricings.find(p => p.planPricingId === pricingId)
    return pricing?.label
  }

  /**
   * Finds the selected pricing from a plan's pricings array
   *
   * @param plans - Array of available offer plans (can be undefined)
   * @returns The selected pricing (where isSelected === true), or undefined if no pricing is selected
   */
  static getSelectedPricing(plans: OfferPlan[] | undefined): OfferPlanPricing | undefined {
    if (plans === undefined || plans.length === 0) {
      return undefined
    }

    const selectedPlan = plans.find(plan => plan.isSelected === true)
    if (selectedPlan === undefined || selectedPlan.pricings === undefined || selectedPlan.pricings.length === 0) {
      return undefined
    }

    return selectedPlan.pricings.find(pricing => pricing.isSelected === true)
  }
}
