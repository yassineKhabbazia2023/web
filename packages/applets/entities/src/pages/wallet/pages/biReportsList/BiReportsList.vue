<template>
  <div
    class="bi-reports-list"
    :class="{ 'bi-reports-list--loading': isLoading }"
  >
    <div
      v-if="isLoading"
      class="flex flex--justify-content-center margin-bottom--6"
      data-testid="bi-reports-list-loader"
    >
      <PLoader
        pType="primary"
        pSize="50"
      />
    </div>
    <div
      v-else
    >
      <ReportTable
        :reports="searchResult.items"
        data-testid="bi-reports-list-table"
      />
    </div>
  </div>
  <PPagination
    v-model:p-page-size="searchCriteria.limit"
    class=" margin-top--6"
    :pCurrentPage="searchCriteria.currentPage"
    :pTotal="searchResult.totalItems"
    :pPageSizes="PAGE_SIZES"
    pPageSizeSelectorSuffix=""
    pShowTotalPageCounter
    data-testid="bi-reports-list-pagination"
    @on-page-range-changed="handlePageRangeChange"
    @update:p-current-page="handleCurrentPageUpdate"
  >
    <p>{{ paginationLabel }}</p>
  </PPagination>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { reactive, onMounted, computed, ref } from 'vue'
import { PPagination, PLoader } from '@pulse/styleguide/components'
import { PAGE_SIZES } from '@entities/constants'
import type { ReportStatusTag, MappedReportRow } from '@entities/common/types/BIReportsTypes'
import { ReportStatus } from '@entities/common/types/BIReports.enums'
import { getPaginationLabel } from '@entities/helper'
import ReportTable from './components/ReportTable'
import { getMappedReport, getReportsQueryParams } from './utils'
import { SearchCriteria, SearchResult } from '../../types'
import { fetchAvailableReports } from '@entities/services/reporting'
import { displayNotification } from '@entities/common/utils'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const isLoading = ref(false)

// Report Statuses
const REPORT_STATUSES: Record<ReportStatus, ReportStatusTag> = {
  [ReportStatus.ONLINE]: { text: t('online'), color: 'success', iconName: 'checkCircle' },
  [ReportStatus.OFFLINE]: { text: t('offline'), color: 'gray-900', iconName: 'eyeSlash' },
  [ReportStatus.INITIALIZED]: { text: t('initialized'), color: 'info', iconName: 'stars' },
  [ReportStatus.FAILED]: { text: t('failed'), color: 'danger', iconName: 'exclamationTriangle' },
}

// #region pagination
const searchCriteria = reactive<SearchCriteria>({
  currentPage: 1,
  limit: PAGE_SIZES[0],
})

const searchResult = reactive<SearchResult<MappedReportRow>>({
  currentPage: 1,
  items: [],
  totalPage: 1,
  totalItems: 1,
})

const paginationLabel = computed(() =>
  getPaginationLabel(t('on'), {
    currentPage: searchCriteria.currentPage,
    limit: searchCriteria.limit,
    data: searchResult.items,
    totalItems: searchResult.totalItems,
  }),
)

const updatePaginationDetails = (
  items: MappedReportRow[],
  currentPage: number,
  totalPage: number,
  totalItems: number,
) => {
  searchResult.items = items
  searchCriteria.currentPage = currentPage
  searchResult.totalItems = totalItems
  searchResult.totalPage = totalPage
}

const handlePageRangeChange = (value: number) => {
  searchCriteria.currentPage = 1
  searchCriteria.limit = value
  fetchReportsData()
}

const handleCurrentPageUpdate = (value: number) => {
  searchCriteria.currentPage = value
  fetchReportsData()
}
// #endregion

const fetchReportsData = async () => {
  isLoading.value = true
  try {
    const reportsQueryParams = getReportsQueryParams(searchCriteria)
    const { items, totalItems, totalPage, currentPage } = await fetchAvailableReports(reportsQueryParams)
    updatePaginationDetails(getMappedReport(items, REPORT_STATUSES), currentPage, totalPage, totalItems)
  } catch {
    displayNotification('error', t('failedFetch'))
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchReportsData()
})
</script>

<style lang="scss">
.bi-reports-list {
  &--loading {
    height: calc(100vh - 230px);
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

<i18n lang="yaml">
en-US:
  on: 'on'
  online: 'Online'
  offline: 'Offline'
  initialized: 'Initialized'
  failed: 'Failure'
  failedFetch: 'Failed to fetch reports.'
  manualUpload: 'Upload Manually'
fr-FR:
  on: 'sur'
  online: 'En ligne'
  offline: 'Hors ligne'
  initialized: 'Initialisé'
  failed: 'Incident'
  failedFetch: 'Échec du chargement des rapports.'
  manualUpload: 'Déposer manuellement'
</i18n>
