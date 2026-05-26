import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { EntitySummary } from '@pulse/common/types'
import { AccountType, SubscriptionOfferCode } from '@pulse/common/enums'

export const useCurrentEntityStore = defineStore('current-entity', () => {
  const currentEntity = ref<EntitySummary>()
  const currentEntityId = computed(() => currentEntity.value?.accountId)
  const currentEntityAccountNumber = computed(() => currentEntity.value?.accountNumber?.toString() ?? '')
  // The backend may return account type values that are not part of the AccountType
  // enum (e.g. 'client' for regular accounts). Anything that is not a prospect is
  // normalized to REGULAR so navigation, guards, etc. match consistently.
  const currentAccountType = computed(() =>
    currentEntity.value?.accountType === AccountType.PROSPECT
      ? AccountType.PROSPECT
      : AccountType.REGULAR,
  )

  function setCurrentEntity(currentEntityArg?: EntitySummary) {
    currentEntity.value = currentEntityArg
  }

  function setCurrentEntityClarityVisibility(isVisible: boolean) {
    if (currentEntity.value !== undefined) {
      currentEntity.value.isClarityVisible = isVisible
    }
  }

  function reset() {
    currentEntity.value = undefined
  }

  function hasOffer(offerCode: SubscriptionOfferCode) {
    const subscriptions = currentEntity.value?.subscriptions
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
    currentEntity,
    currentEntityId,
    currentAccountType,
    setCurrentEntity,
    setCurrentEntityClarityVisibility,
    currentEntityAccountNumber,
    reset,
    hasOffer,
  }
})
