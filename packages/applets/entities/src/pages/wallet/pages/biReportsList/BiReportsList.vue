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
    <div v-else>
      <ReportTable
        :reports="searchResult.items"
        data-testid="bi-reports-list-table"
        @update-report-status="handleUpdateReportStatus"
      />
    </div>
  </div>
  <PPagination
    v-model:p-page-size="searchCriteria.limit"
    class="margin-top--6"
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
import { fetchAvailableReports, updateReportStatus } from '@entities/services/reporting'
import { displayNotification } from '@entities/common/utils'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const isLoading = ref(false)

// #region manage report status
const REPORT_STATUSES: Record<ReportStatus, ReportStatusTag> = {
  [ReportStatus.ONLINE]: { type: ReportStatus.ONLINE, text: t('online'), color: 'success', iconName: 'checkCircle' },
  [ReportStatus.OFFLINE]: { type: ReportStatus.OFFLINE, text: t('offline'), color: 'gray-900', iconName: 'eyeSlash' },
  [ReportStatus.INITIALIZED]: { type: ReportStatus.INITIALIZED,text: t('initialized'), color: 'info', iconName: 'stars' },
  [ReportStatus.FAILED]: { type: ReportStatus.FAILED, text: t('failed'), color: 'danger', iconName: 'exclamationTriangle' },
}

const handleUpdateReportStatus = async (
  accountId: number,
  reportId: number,
  reportName: string,
  status: ReportStatus,
) => {
  try {
    await updateReportStatus(accountId, reportId, status)
    fetchReportsData()
    const action = status === ReportStatus.ONLINE ? t('activated') : t('deactivated')
    displayNotification('success', t('statusChange', { reportName, action }))
  } catch {
    displayNotification(
      'error',
      status === ReportStatus.ONLINE ? t('errors.reportActivation') : t('errors.reportDeactivation'),
    )
  }
}
// #endregion

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
    displayNotification('error', t('errors.reportFetch'))
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
  activated: "activated"
  deactivated: "deactivated"
  manualUpload: 'Upload Manually'
  statusChange: 'The report {reportName} has been successfully {action}.'
  errors:
    reportActivation: >
      An error occurred while activating the report. Please try again or contact support if the issue
      continues.
    reportDeactivation: >
      An error occurred while deactivating the report. Please try again later or contact our support team.
    reportFetch: >
      We couldn't load the reports. Please check your connection or try again shortly.
fr-FR:
  on: 'sur'
  online: 'En ligne'
  offline: 'Hors ligne'
  initialized: 'Initialisé'
  failed: 'Incident'
  activated: "activé"
  deactivated: "désactivé"
  manualUpload: 'Déposer manuellement'
  statusChange: 'Le rapport {reportName} a été {action} avec succès.'
  errors:
    reportActivation: >
      Une erreur est survenue lors de l'activation du rapport. Veuillez réessayer ou contacter le support
      si le problème persiste.
    reportDeactivation: >
      Une erreur est survenue lors de la désactivation du rapport. Merci de réessayer ultérieurement ou de
      contacter notre équipe d'assistance.
    reportFetch: >
      Nous n'avons pas pu charger les rapports. Vérifiez votre connexion ou réessayez dans quelques instants.
</i18n>
