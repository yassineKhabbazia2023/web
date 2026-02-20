import { ref, computed } from 'vue'
import type { AccountOperations } from '@entities/services/registry'
import { fetchAccountOperations } from '@entities/services/registry'
import type { PaginationResponse } from '@pulse/common/types'

export function useManageAccessOperations(pageSize: number) {
  const searchResult = ref<PaginationResponse<AccountOperations>>()
  const isLoadingOperations = ref(false)
  const searchTerm = ref('')

  const showPagination = computed(() => (searchResult.value?.totalPages ?? 0) > 1)
  const showNoOperation = computed(() => isLoadingOperations.value === false && (searchResult.value?.items.length ?? -1) === 0 && searchTerm.value === '')

  async function loadOperations(page: number) {
    return await fetchAccountOperations(page, pageSize, searchTerm.value)
  }

  async function refreshManageAccessOperations({
    page,
  }: {
    page?: number
  } = {}) {
    isLoadingOperations.value = true
    const currentPage = page ?? searchResult.value?.currentPage ?? 1
    const searchResultWithCurrentPage = await loadOperations(currentPage)
    if (currentPage > searchResultWithCurrentPage.totalPages) {
      const lastPage = searchResultWithCurrentPage.totalPages
      const searchResultWithLastPage = await loadOperations(lastPage)
      searchResult.value = searchResultWithLastPage
    } else {
      searchResult.value = searchResultWithCurrentPage
    }
    isLoadingOperations.value = false
  }

  return {
    isLoadingOperations,
    searchTerm,
    searchResult,
    showPagination,
    showNoOperation,
    refreshManageAccessOperations,
  }
}
