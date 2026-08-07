import { onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { logger } from '@pulse/toolbox'
import { PAGE_SIZES } from '@pulse/common/constants'
import { SeresInvoicesService } from './seres-invoices.service'
import type { SortDirection } from '@pulse/common/enums'
import type { SortChangeEventData } from '@pulse/common/types'
import type { SeresInvoiceItem } from './seres-invoices.types'

export function useSeresInvoices(currentAccountId: Ref<number | null>, searchQuery: Ref<string>) {
  const isLoading = ref(true)
  const invoices = ref<SeresInvoiceItem[]>([])
  const currentPage = ref(1)
  const pageSize = ref(PAGE_SIZES[0])
  const totalItems = ref(0)
  const sortBy = ref('')
  const sortOrder = ref<SortDirection | null>(null)

  let lastRequestId = 0
  const isOutdatedRequest = (requestId: number): boolean => requestId !== lastRequestId

  const loadInvoices = async () => {
    if (currentAccountId.value === null) {
      isLoading.value = false
      return
    }

    isLoading.value = true
    const requestId = ++lastRequestId

    try {
      const response = await SeresInvoicesService.fetchInvoices(currentAccountId.value, {
        page: currentPage.value,
        pageSize: pageSize.value,
        search: searchQuery.value,
        sortBy: sortBy.value,
        sortOrder: sortOrder.value,
      })

      if (isOutdatedRequest(requestId)) {
        return
      }

      invoices.value = response.items
      totalItems.value = response.totalItems
    } catch (error) {
      if (isOutdatedRequest(requestId)) {
        return
      }

      logger.error('Error fetching Seres invoices', error)
      invoices.value = []
      totalItems.value = 0
    } finally {
      if (isOutdatedRequest(requestId) === false) {
        isLoading.value = false
      }
    }
  }

  const reloadFromFirstPage = async () => {
    currentPage.value = 1
    await loadInvoices()
  }

  const onUpdateCurrentPage = async (page: number) => {
    currentPage.value = page
    await loadInvoices()
  }

  const onPageRangeChanged = async (newPageSize: number) => {
    pageSize.value = newPageSize
    await reloadFromFirstPage()
  }

  const onSortChange = async ({ prop, order }: SortChangeEventData) => {
    sortBy.value = prop
    sortOrder.value = order
    await reloadFromFirstPage()
  }

  watch(searchQuery, reloadFromFirstPage)

  onMounted(async () => {
    await loadInvoices()
  })

  return {
    isLoading,
    invoices,
    currentPage,
    pageSize,
    totalItems,
    onUpdateCurrentPage,
    onPageRangeChanged,
    onSortChange,
  }
}
