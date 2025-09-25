import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { EntitySummary } from '@pulse/common/types'
import { SubscriptionOfferCode } from '@pulse/common/enums'

export const useSelectedEntityStore = defineStore('selected-entity', () => {
  const selectedEntity = ref<EntitySummary>()
  const selectedEntityId = computed(() => selectedEntity.value?.accountId)
  const selectedEntityAccountNumber = computed(() => selectedEntity.value?.accountNumber?.toString() ?? '')

  function setSelectedEntity(selectedEntityArg?: EntitySummary) {
    selectedEntity.value = selectedEntityArg
  }

  function setSelectedEntityClarityVisibility(isVisible: boolean) {
    if (selectedEntity.value !== undefined) {
      selectedEntity.value.isClarityVisible = isVisible
    }
  }

  function reset() {
    selectedEntity.value = undefined
  }

  function hasOffer(offerCode: SubscriptionOfferCode) {
    const subscriptions = selectedEntity.value?.subscriptions
    if (subscriptions === undefined) {
      return false
    }
    const hasOffer = subscriptions.some(subscription =>
      subscription.offerCode === offerCode &&
      subscription.status === 'validated',
    )

    return hasOffer === true
  }

  return {
    selectedEntity,
    selectedEntityId,
    setSelectedEntity,
    setSelectedEntityClarityVisibility,
    selectedEntityAccountNumber,
    reset,
    hasOffer,
  }
})
