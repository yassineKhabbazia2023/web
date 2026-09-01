import { onMounted, ref } from 'vue'
import { logger } from '@pulse/toolbox'
import { PAGE_SIZES } from '@pulse/common/constants'
import {
  fetchPendingDelegationRequests,
  acceptDelegationRequests,
  refuseDelegationRequests,
} from '@entities/services/account'
import type { DelegationRequestApiItem } from '@entities/services/account/account.type'
import type { PendingRequestItem } from './pending-requests.types'

function mapApiItemToModel(item: DelegationRequestApiItem): PendingRequestItem {
  return {
    delegationRequestId: item.delegationRequestId,
    createdAt: item.createdAt,
    requester: {
      firstName: item.requester.firstName,
      lastName: item.requester.lastName,
    },
    account: {
      legalName: item.account.legalName,
      accountNumber: item.account.accountNumber,
    },
  }
}

export function usePendingRequests() {
  const items = ref<PendingRequestItem[]>([])
  const isLoading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(PAGE_SIZES[0])
  const totalItems = ref(0)
  const selectedIds = ref<number[]>([])
  const isSubmitting = ref(false)

  async function refresh() {
    isLoading.value = true
    try {
      const response = await fetchPendingDelegationRequests(currentPage.value, pageSize.value)
      items.value = response?.items?.map(mapApiItemToModel) ?? []
      totalItems.value = response?.totalItems ?? 0
    } catch (error) {
      logger.error(error)
      items.value = []
      totalItems.value = 0
    } finally {
      isLoading.value = false
    }
  }

  async function refreshAfterMutation() {
    await refresh()
    if (items.value.length === 0 && currentPage.value > 1) {
      currentPage.value -= 1
      await refresh()
    }
  }

  async function changePage(page: number) {
    currentPage.value = page
    selectedIds.value = []
    await refresh()
  }

  async function changePageSize(size: number) {
    pageSize.value = size
    currentPage.value = 1
    selectedIds.value = []
    await refresh()
  }

  async function acceptSelected() {
    isSubmitting.value = true
    try {
      await acceptDelegationRequests(selectedIds.value)
      selectedIds.value = []
      await refreshAfterMutation()
    } catch (error) {
      logger.error(error)
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  async function refuseSelected() {
    isSubmitting.value = true
    try {
      await refuseDelegationRequests(selectedIds.value)
      selectedIds.value = []
      await refreshAfterMutation()
    } catch (error) {
      logger.error(error)
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  onMounted(() => {
    refresh()
  })

  return {
    items,
    isLoading,
    currentPage,
    pageSize,
    totalItems,
    selectedIds,
    isSubmitting,
    changePage,
    changePageSize,
    acceptSelected,
    refuseSelected,
  }
}
