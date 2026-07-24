import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { displayNotification, useResponsive } from '@pulse/styleguide'
import { useUserStore } from '@pulse/common/stores'
import { PAGE_SIZES, MOBILE_PAGE_SIZES, HTTP_RESPONSES } from '@pulse/common/constants'
import { getPaginationLabel } from '@pulse/common/utils'
import { logger } from '@pulse/toolbox'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import type { AxiosError } from 'axios'
import { ProspectListType } from '@entities/modules/wallet/enums'
import type { SearchCriteria, SearchResult, ProspectWalletData, ProspectCreationPayload } from '@entities/modules/wallet/types'
import { ProspectsManager } from './prospects.manager'
import { CurrentUserService } from '@pulse/common/services/current-user'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import type { CreateProspectErrorResponse } from '@entities/services/prospects/prospects.types'

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

  const isProspectCreationDrawerOpened = ref(false)
  const isProspectSubmitting = ref(false)

  function openProspectCreationDrawer() {
    isProspectCreationDrawerOpened.value = true
  }

  async function onProspectCreationSubmit(payload: ProspectCreationPayload) {
    isProspectSubmitting.value = true
    try {
      await ProspectsService.createProspect(payload)
    } catch (error) {
      const axiosError = error as AxiosError<CreateProspectErrorResponse>
      const serverMessage = axiosError.response?.data?.errorMessage
      // Business validation error (422): display the message returned by the server in the toaster
      if (axiosError.response?.status === HTTP_RESPONSES.UNPROCESSABLE_ENTITY && isNotNullNorEmpty(serverMessage)) {
        // Longer duration: the server message can be verbose and needs more reading time
        displayNotification('error', serverMessage, 'bottom-right', 5000)
      } else {
        logger.error('Failed to create prospect', error)
        displayNotification('error', t('entities.wallet.prospectCreate.error'))
      }
      return
    } finally {
      isProspectSubmitting.value = false
    }
    isProspectCreationDrawerOpened.value = false
    displayNotification('success', t('entities.wallet.prospectCreate.success'))
    await fetchProspectsList()
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
    isProspectCreationDrawerOpened,
    isProspectSubmitting,
    fetchProspectsList,
    openProspectCreationDrawer,
    onProspectCreationSubmit,
    handleSearchValueSubmitted,
    handlePageRangeChanged,
    onUpdateCurrentPage,
  }
}
