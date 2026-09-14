import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { logger } from '@pulse/toolbox'
import { useResponsive } from '@pulse/styleguide'
import { useUserStore } from '@pulse/common/stores'
import { useSort } from '@pulse/common/composables/sort'
import { getPaginationLabel } from '@pulse/common/utils'
import { RouteName } from '@pulse/common/enums'
import type { SortingCriteria } from '@pulse/common/types'
import { fetchFavoriteEntities, manageFavoriteEntities } from '@entities/services/wallet'
import { WalletTrackingManager } from '@entities/managers/wallet-tracking/wallet-tracking.manager'
import type { EntityStatus } from '@entities/modules/wallet/enums'
import type { RegularWalletData, SearchCriteria, SearchResult } from '@entities/modules/wallet/types'
import { fetchWalletData } from './FoldersUtils'
import { useFolderSelection } from './folder-selection.composable'
import { FoldersManager } from './folders.manager'
import {
  DESKTOP_FOLDERS_PAGE_SIZE,
  FOLDERS_PAGE_SIZES_DESKTOP,
  FOLDERS_PAGE_SIZES_MOBILE,
  I18N_KEY,
  MOBILE_FOLDERS_PAGE_SIZE,
} from './folders.consts'

export function useFolders() {
  const { t } = useI18n()
  const router = useRouter()
  const route = useRoute()
  const userStore = useUserStore()
  const { isMobile } = useResponsive()
  const { handleSortCriteria } = useSort()

  const deploymentStatuses = FoldersManager.getDeploymentStatuses()

  const searchPlaceholder = computed(() =>
    isMobile.value ? t(`${I18N_KEY}.searchShort`) : t(`${I18N_KEY}.search`),
  )

  const pageSizes = computed(() =>
    isMobile.value ? FOLDERS_PAGE_SIZES_MOBILE : FOLDERS_PAGE_SIZES_DESKTOP,
  )
  const currentFoldersPageSize = computed(() =>
    isMobile.value ? MOBILE_FOLDERS_PAGE_SIZE : DESKTOP_FOLDERS_PAGE_SIZE,
  )

  const isLoading = ref(true)
  const isLoadingMore = ref(false)
  const shouldAppendNextFetch = ref(false)
  const totalAccounts = ref(0)

  const searchCriteria = ref<SearchCriteria>({
    currentPage: 0,
    limit: currentFoldersPageSize.value,
    search: '',
    sorting: FoldersManager.getDefaultSorting(),
    filterByDeploymentStatus: undefined,
    filterByMissionType: undefined,
    filterByLastActivityPeriodInDays: undefined,
    isFavoriteFilter: false,
    isCustomerRelationFilter: false,
  })

  const searchResult = ref<SearchResult<RegularWalletData>>({
    currentPage: 0,
    items: [],
    totalPage: 0,
    totalItems: 0,
  })

  const {
    selectedFolders,
    selectedFolderIds,
  } = useFolderSelection(searchResult)

  const paginationLabel = computed(() => getPaginationLabel(t(`${I18N_KEY}.on`), {
    currentPage: searchCriteria.value.currentPage,
    limit: searchCriteria.value.limit,
    data: searchResult.value.items,
    totalItems: searchResult.value.totalItems,
  }))

  const hasMoreResults = computed(() =>
    searchResult.value.items.length < searchResult.value.totalItems,
  )

  async function fetchAccountList(shouldAppendResults = false) {
    if (shouldAppendResults) {
      isLoadingMore.value = true
    } else {
      isLoading.value = true
    }

    try {
      const queryResult = await fetchWalletData(deploymentStatuses, { ...searchCriteria.value })

      searchResult.value.items = shouldAppendResults
        ? [...searchResult.value.items, ...queryResult.items]
        : queryResult.items
      searchResult.value.currentPage = queryResult.currentPage
      searchResult.value.totalPage = queryResult.totalPage
      searchResult.value.totalItems = queryResult.totalItems
    } catch (error) {
      logger.error('Error while fetching data', error)
    } finally {
      if (shouldAppendResults) {
        isLoadingMore.value = false
      } else {
        isLoading.value = false
      }
    }
  }

  async function fetchTableDataAndFavorites() {
    const [, favoriteEntities] = await Promise.all([
      fetchAccountList(),
      fetchFavoriteEntities(),
    ])
    userStore.setFavoriteEntities(FoldersManager.toFavoriteEntities(favoriteEntities))
  }

  async function handleAddFavorite(accountId: number, isFavorite: boolean) {
    await manageFavoriteEntities(accountId, isFavorite)
    await fetchTableDataAndFavorites()
  }

  function loadMoreResults() {
    if (isLoadingMore.value === true || hasMoreResults.value === false) {
      return
    }

    const nextPage = searchResult.value.currentPage + 1

    shouldAppendNextFetch.value = true
    isLoadingMore.value = true
    WalletTrackingManager.trackPaginationPageClicked(nextPage)
    searchCriteria.value.currentPage = nextPage
  }

  function handleSearchValueSubmitted(searchValue: string) {
    searchCriteria.value.currentPage = 1
    searchCriteria.value.search = searchValue
  }

  function handlePageRangeChanged(pageRange: number) {
    WalletTrackingManager.trackPaginationSizeChanged(pageRange)
    searchCriteria.value.currentPage = 1
    searchCriteria.value.limit = pageRange
  }

  function onUpdateCurrentPage(currentPage: number) {
    WalletTrackingManager.trackPaginationPageClicked(currentPage)
    searchCriteria.value.currentPage = currentPage
  }

  function handleSortAccount(sortingCriteria: SortingCriteria) {
    handleSortCriteria(sortingCriteria, searchCriteria.value)
  }

  /**
   * Resets every criterion, keeping only the optional deployment status shortcut.
   */
  function resetSearchCriteria(status?: EntityStatus) {
    searchCriteria.value = FoldersManager.getDeploymentStatusSearchCriteria(
      currentFoldersPageSize.value,
      status,
    )
  }

  function retrieveAndBindAccountsQuery() {
    const { accountNumbers } = route.query
    if (accountNumbers === undefined || accountNumbers === null || accountNumbers === '') {
      return
    }

    searchCriteria.value.search = FoldersManager.getSearchValueFromAccountNumbers(accountNumbers)
  }

  const routeQuery = computed(() => route.query)

  // Registered before the search criteria watcher so the immediate run binds the
  // account numbers query without triggering an extra fetch.
  watch(routeQuery, () => {
    if (route.name === RouteName.FOLDERS) {
      retrieveAndBindAccountsQuery()
      router.replace({
        query: {},
      })
    }
  }, {
    immediate: true,
  })

  onBeforeRouteUpdate((to, from) => {
    if (to.name === from.name && to.query !== from.query) {
      retrieveAndBindAccountsQuery()
    }
  })

  onMounted(async () => {
    await fetchTableDataAndFavorites()
    totalAccounts.value = searchResult.value.totalItems // Store the nb of total account for later use
  })

  watch(searchCriteria, async () => {
    const shouldAppendResults = shouldAppendNextFetch.value
    shouldAppendNextFetch.value = false
    await fetchAccountList(shouldAppendResults)
  }, { deep: true })

  watch(currentFoldersPageSize, (limit) => {
    searchCriteria.value.currentPage = 0
    searchCriteria.value.limit = limit
  })

  return {
    isLoading,
    isLoadingMore,
    searchCriteria,
    searchResult,
    selectedFolders,
    selectedFolderIds,
    searchPlaceholder,
    pageSizes,
    paginationLabel,
    hasMoreResults,
    totalAccounts,
    fetchAccountList,
    fetchTableDataAndFavorites,
    handleAddFavorite,
    loadMoreResults,
    handleSearchValueSubmitted,
    handlePageRangeChanged,
    onUpdateCurrentPage,
    handleSortAccount,
    resetSearchCriteria,
  }
}
