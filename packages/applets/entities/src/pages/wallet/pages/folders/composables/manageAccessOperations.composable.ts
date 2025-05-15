import { ref } from 'vue'
import type { AccountOperations } from '@entities/services/contact/contactTypes'
import { fetchAccountOperations } from '@entities/services/contact'
import { logger } from '@pulse/core'

export function useManageAccessOperations(pageSize: number) {
  const manageAccessPage = ref(1)
  const manageAccessCount = ref(0)
  const accountOperationsTotalPages = ref(0)
  const isLoadingOperations = ref(false)
  const accountOperationsList = ref<AccountOperations[]>([])

  async function loadOperations(page: number, pageSize: number) {
    isLoadingOperations.value = true
    try {
      const { items, totalItems, totalPages } = await fetchAccountOperations(page, pageSize)
      accountOperationsList.value = items
      accountOperationsTotalPages.value = totalPages
      setManageAccessCount(totalItems)
    } catch (error) {
      logger.error('Unable to fetch operations: ', error)
    } finally {
      isLoadingOperations.value = false
    }
  }

  async function refreshManageAccessOperations({
    currentPage,
  }: {
    currentPage?: number
  } = {}) {
    if (currentPage !== undefined) {
      manageAccessPage.value = currentPage
    }
    await loadOperations(manageAccessPage.value, pageSize)
    if (manageAccessPage.value > accountOperationsTotalPages.value) {
      manageAccessPage.value = accountOperationsTotalPages.value
      await loadOperations(manageAccessPage.value, pageSize)
    }
  }

  async function refreshPageCount() {
    // we just want the totalItems from the api
    const { totalItems } = await fetchAccountOperations(1, 1)

    setManageAccessCount(totalItems)
  }

  function setManageAccessCount(totalItems: number) {
    manageAccessCount.value = totalItems
  }

  return {
    manageAccessPage,
    manageAccessCount,
    accountOperationsList,
    refreshManageAccessOperations,
    refreshPageCount,
  }
}
