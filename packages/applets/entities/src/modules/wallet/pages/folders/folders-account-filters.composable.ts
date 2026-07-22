import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import type { AccountFilters } from '@entities/types'
import type { SearchCriteria } from '@entities/modules/wallet/types'
import { getDefaultAccountFilters } from './components/AccountFiltersDrawer/account-filters-drawer.utils'
import { FoldersManager } from './folders.manager'

export function useFoldersAccountFilters(searchCriteria: Ref<SearchCriteria>) {
  const hasActiveFilters = ref(false)
  const isFiltersDrawerOpen = ref(false)
  const accountFilters = ref<AccountFilters>(getDefaultAccountFilters())

  const accountFiltersCount = computed(() => FoldersManager.countActiveFilters(accountFilters.value))

  function openFiltersDrawer() {
    isFiltersDrawerOpen.value = true
  }

  function closeFiltersDrawer() {
    isFiltersDrawerOpen.value = false
  }

  function applyAccountFilters(appliedFilters: AccountFilters) {
    accountFilters.value = appliedFilters
    searchCriteria.value = FoldersManager.applyFiltersToSearchCriteria(
      searchCriteria.value,
      appliedFilters,
    )
    closeFiltersDrawer()
  }

  function clearAllAccountFilters() {
    accountFilters.value = getDefaultAccountFilters()
    searchCriteria.value = FoldersManager.clearFiltersFromSearchCriteria(searchCriteria.value)
    hasActiveFilters.value = false
    closeFiltersDrawer()
  }

  return {
    hasActiveFilters,
    isFiltersDrawerOpen,
    accountFilters,
    accountFiltersCount,
    openFiltersDrawer,
    applyAccountFilters,
    clearAllAccountFilters,
  }
}
