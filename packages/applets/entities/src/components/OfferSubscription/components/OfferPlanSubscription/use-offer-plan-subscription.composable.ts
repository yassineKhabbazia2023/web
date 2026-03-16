import { computed, watch, onMounted } from 'vue'
import { PlanCode } from '@entities/enums'
import type { UseOfferPlanSubscriptionParams } from './OfferPlanSubscription.type'

export function useOfferPlanSubscription({
  plans,
  isRecap,
  selectedPlanId,
  selectedPricingId,
}: UseOfferPlanSubscriptionParams) {
  const selectedPlan = computed(() => {
    if (isRecap.value === true) {
      return plans.value.find(plan => plan.isSelected === true)
    }
    return plans.value.find(plan => plan.planId === selectedPlanId.value)
  })

  const selectedPlanPricings = computed(() =>
    selectedPlan.value?.pricings ?? [],
  )

  const pricingGridClass = computed(() => {
    const count = selectedPlanPricings.value.length
    if (count === 1) {
      return 'grid-cols--1'
    }
    if (count === 2) {
      return 'grid-cols--2'
    }
    return 'grid-cols--3'
  })

  const isPremiumInternalise = computed(() =>
    selectedPlan.value?.planCode === PlanCode.PREMIUM_INTERNAL,
  )

  function initializeRecapMode() {
    if (isRecap.value !== true || selectedPlan.value === undefined) {
      return
    }

    selectedPlanId.value = selectedPlan.value.planId

    const apiSelectedPricing = selectedPlan.value.pricings.find(
      pricing => pricing.isSelected === true,
    )
    if (apiSelectedPricing !== undefined) {
      selectedPricingId.value = apiSelectedPricing.planPricingId
    }
  }

  function handlePlanChange(newPlanId: number | undefined) {
    if (isRecap.value === true) {
      return
    }

    const plan = plans.value.find(p => p.planId === newPlanId)

    if (plan?.pricings?.length === 1) {
      selectedPricingId.value = plan.pricings[0].planPricingId
    } else {
      selectedPricingId.value = undefined
    }
  }

  onMounted(() => {
    initializeRecapMode()
  })

  watch(selectedPlanId, handlePlanChange, { immediate: true })

  return {
    selectedPlan,
    selectedPlanPricings,
    pricingGridClass,
    isPremiumInternalise,
    initializeRecapMode,
    handlePlanChange,
  }
}
