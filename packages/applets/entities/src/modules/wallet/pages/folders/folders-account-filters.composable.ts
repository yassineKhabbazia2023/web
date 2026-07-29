import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import type { AccountFilters } from '@entities/types'
import type { SearchCriteria } from '@entities/modules/wallet/types'
import { getDefaultAccountFilters } from './components/AccountFiltersDrawer/account-filters-drawer.utils'
import { FoldersManager } from './folders.manager'

export function useFoldersAccountFilters(
  searchCriteria: Ref<SearchCriteria>,
  clearSelectedFolders: () => void,
) {
  const hasActiveFilters = ref(false)
  const isFiltersDrawerOpen = ref(false)
  const accountFilters = ref<AccountFilters>(getDefaultAccountFilters())

  const accountFiltersCount = computed(() => FoldersManager.countActiveFilters(accountFilters.value))
  const activeFilterItems = computed(() => FoldersManager.toActiveFilterItems(accountFilters.value))

  function openFiltersDrawer() {
    isFiltersDrawerOpen.value = true
  }

  function closeFiltersDrawer() {
    isFiltersDrawerOpen.value = false
  }

  function setAccountFilters(nextFilters: AccountFilters) {
    accountFilters.value = nextFilters
    searchCriteria.value = FoldersManager.applyFiltersToSearchCriteria(
      searchCriteria.value,
      nextFilters,
    )
    hasActiveFilters.value = FoldersManager.countActiveFilters(nextFilters) > 0
    clearSelectedFolders()
  }

  function applyAccountFilters(appliedFilters: AccountFilters) {
    setAccountFilters(appliedFilters)
    closeFiltersDrawer()
  }

  function removeAccountFilter(code: string) {
    setAccountFilters(FoldersManager.removeFilterFromAccountFilters(accountFilters.value, code))
  }

  function clearAllAccountFilters() {
    setAccountFilters(getDefaultAccountFilters())
    closeFiltersDrawer()
  }

  return {
    hasActiveFilters,
    isFiltersDrawerOpen,
    accountFilters,
    accountFiltersCount,
    activeFilterItems,
    openFiltersDrawer,
    applyAccountFilters,
    removeAccountFilter,
    clearAllAccountFilters,
  }
}
