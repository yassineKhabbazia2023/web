import { onMounted, ref } from 'vue'
import { logger } from '@pulse/toolbox'
import { useUserStore } from '@pulse/common/stores'
import { storeToRefs } from 'pinia'
import { fetchPermanentDelegations, deleteAccountDelegation } from '@entities/services/account'
import { DelegationTrackingManager } from '@entities/managers/delegation-tracking/delegation-tracking.manager'
import type { PermanentDelegationItem } from './permanent-delegations.types'
import type { PermanentDelegationApiItem } from '@entities/services/account/account.type'

export function usePermanentDelegations() {
  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)

  const permanentDelegations = ref<PermanentDelegationItem[]>([])
  const isLoading = ref(false)

  function mapApiItemToModel(item: PermanentDelegationApiItem): PermanentDelegationItem {
    return {
      delegationId: item.delegationId,
      startDate: item.startDate,
      delegatee: {
        contactId: item.delegatee.contactId,
        firstName: item.delegatee.firstName,
        lastName: item.delegatee.lastName,
        email: item.delegatee.email,
      },
    }
  }

  async function refreshDelegations() {
    isLoading.value = true
    try {
      const response = await fetchPermanentDelegations()
      permanentDelegations.value = response?.items?.map(mapApiItemToModel) ?? []
    } catch (error) {
      logger.error(error)
    } finally {
      isLoading.value = false
    }
  }

  async function removeDelegation(delegation: PermanentDelegationItem) {
    const delegatorId = user.value?.id
    if (delegatorId == null) {
      throw new Error('User not available')
    }

    try {
      await deleteAccountDelegation(
        delegation.delegationId,
        delegatorId,
        delegation.delegatee.contactId,
      )
      await refreshDelegations()
      DelegationTrackingManager.trackPermanentDeleteCompleted('succeeded')
    } catch (error) {
      logger.error(error)
      DelegationTrackingManager.trackPermanentDeleteCompleted('failed')
      throw error
    }
  }

  onMounted(() => {
    refreshDelegations()
  })

  return {
    permanentDelegations,
    isLoading,
    removeDelegation,
  }
}
