import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useResponsive } from '@pulse/styleguide'
import { useUserStore } from '@pulse/common/stores'
import { PAGE_SIZES, MOBILE_PAGE_SIZES } from '@pulse/common/constants'
import { getPaginationLabel } from '@pulse/common/utils'
import { ProspectListType } from '@entities/modules/wallet/enums'
import type { SearchCriteria, SearchResult, ProspectWalletData } from '@entities/modules/wallet/types'
import { ProspectsManager } from './prospects.manager'
import { CurrentUserService } from '@pulse/common/services/current-user'

const EMPTY_SEARCH_RESULT: SearchResult<ProspectWalletData> = {
  currentPage: 0,
  items: [],
  totalPage: 0,
  totalItems: 0,
}

export function useProspects() {
  const { t } = useI18n()

  const userStore = useUserStore()
  const { isCollab } = storeToRefs(userStore)
  const { isMobile } = useResponsive()

  const prospectListType = computed(() =>
    isCollab.value === true ? ProspectListType.PROSPECT_COLLAB : ProspectListType.PROSPECT_CUSTOMER,
  )

  const searchPlaceholder = computed(() =>
    isMobile.value ? t('entities.wallet.prospectsPage.searchShort') : t('entities.wallet.prospectsPage.search'),
  )

  const pageSizes = computed(() =>
    isMobile.value ? [5, ...MOBILE_PAGE_SIZES, ...PAGE_SIZES] : PAGE_SIZES,
  )
  const currentPageSize = computed((): number => pageSizes.value[0])

  const isLoading = ref(true)

  const searchCriteria = ref<SearchCriteria>({
    currentPage: 1,
    limit: currentPageSize.value,
    search: '',
    sorting: {
      field: '',
      descending: false,
    },
  })

  const searchResult = ref<SearchResult<ProspectWalletData>>({ ...EMPTY_SEARCH_RESULT })

  async function fetchProspectsList() {
    isLoading.value = true
    try {
      const newCount = await CurrentUserService.getUserWalletInformation()
      userStore.setWalletInformation(newCount)
      searchResult.value = await ProspectsManager.fetchProspectsData(searchCriteria.value)
    } finally {
      isLoading.value = false
    }
  }

  function handleSearchValueSubmitted(searchValue: string) {
    searchCriteria.value.currentPage = 1
    searchCriteria.value.search = searchValue
  }

  function handlePageRangeChanged(pageRange: number) {
    searchCriteria.value.currentPage = 1
    searchCriteria.value.limit = pageRange
  }

  function onUpdateCurrentPage(currentPage: number) {
    searchCriteria.value.currentPage = currentPage
  }

  const paginationLabel = computed(() => getPaginationLabel(t('entities.wallet.prospectsPage.on'), {
    currentPage: searchCriteria.value.currentPage,
    limit: searchCriteria.value.limit,
    data: searchResult.value.items,
    totalItems: searchResult.value.totalItems,
  }))

  watch(searchCriteria, async () => {
    await fetchProspectsList()
  }, {
    immediate: true,
    deep: true,
  })

  return {
    isLoading,
    searchCriteria,
    searchResult,
    prospectListType,
    searchPlaceholder,
    pageSizes,
    paginationLabel,
    fetchProspectsList,
    handleSearchValueSubmitted,
    handlePageRangeChanged,
    onUpdateCurrentPage,
  }
}
