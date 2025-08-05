<template>
  <ReportToolbar
    :reportStatistics
    @search-report="handleSearchReport"
    @apply-filters="handleApplyReportFilters"
    @clear-filters="handleClearReportFilters"
  />
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
      <ReportDeletionDialog
        v-if="isReportDeletionDialogVisible === true"
        v-model:isReportDeletionDialogVisible="isReportDeletionDialogVisible"
        :reportName="selectedReportName"
        @delete-report="handleReportDeletion"
      />
      <ReportTable
        :reports="searchResult.items"
        data-testid="bi-reports-list-table"
        @update-report-status="handleUpdateReportStatus"
        @view-report-fullscreen="handleViewReportFullscreen"
        @delete-report="handleDeleteReport"
      />
      <PowerBIReportViewer
        v-model="isReportFullscreenVisible"
        :reportLabel="selectedReportLabel"
        :powerBIConfig="powerBIConfig"
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
import { logger } from '@pulse/core'
import { models } from 'powerbi-client'
import { reactive, onMounted, computed, ref } from 'vue'
import { PPagination, PLoader } from '@pulse/styleguide/components'
import ReportToolbar from './components/ReportToolbar'
import { PAGE_SIZES } from '@entities/constants'
import type {
  ReportStatusTag,
  MappedReportRow,
  ReportFilters,
  ReportSearchCriteria,
  ReportStatistics,
} from '@entities/common/types/BIReportsTypes'
import { ReportStatus } from '@entities/common/types/BIReports.enums'
import { getPaginationLabel } from '@entities/helper'
import ReportTable from './components/ReportTable'
import { getMappedReport, getReportsQueryParams } from './utils'
import { SearchResult } from '../../types'
import { deleteBIReport, fetchAvailableReports, fetchBIToken, fetchReportStatistics, updateReportStatus } from '@entities/services/reporting'
import { displayNotification } from '@pulse/styleguide'
import PowerBIReportViewer from '@entities/common/components/PowerBIReportViewer'
import ReportDeletionDialog from './components/ReportDeletionDialog/report-deletion-dialog.vue'
import { ReportDeleteOption } from './components/ReportDeletionDialog/report-deletion-dialog.enums'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const isLoading = ref(false)

// #region manage report status
const REPORT_STATUSES: Record<ReportStatus, ReportStatusTag> = {
  [ReportStatus.ONLINE]: { type: ReportStatus.ONLINE, text: t('online'), color: 'success', iconName: 'checkCircle' },
  [ReportStatus.OFFLINE]: { type: ReportStatus.OFFLINE, text: t('offline'), color: 'gray-900', iconName: 'eyeSlash' },
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

// #region report toolbar actions
const reportStatistics = ref<ReportStatistics>()

const handleSearchReport = (term: string) => {
  if (searchCriteria.search !== term) {
    searchCriteria.currentPage = 1
    searchCriteria.search = term
    fetchReportsData()
  }
}

const handleApplyReportFilters = (reportFilters: ReportFilters) => {
  searchCriteria.currentPage = 1
  searchCriteria.reportStatusFilter = reportFilters.reportStatusFilter
  searchCriteria.reportTypeIdFilter = reportFilters.reportTypeIdFilter

  fetchReportsData()
}

const handleClearReportFilters = () => {
  searchCriteria.currentPage = 1
  searchCriteria.reportStatusFilter = []
  searchCriteria.reportTypeIdFilter = []

  fetchReportsData()
}

const fetchReportStatisticsData = async () => {
  try {
    reportStatistics.value = await fetchReportStatistics()
  } catch (error) {
    logger.error('Error fetching report statistics: ', error)
  }
}

// #endregion

// #region manage pagination
const searchCriteria = reactive<ReportSearchCriteria>({
  search: '',
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

// #region fetch report data
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
// #endregion

// #region Fullscreen Report View Display
const selectedReportLabel = ref('')
const isReportFullscreenVisible = ref(false)

const openReportFullscreen = () => {
  isReportFullscreenVisible.value = true
}

const powerBIConfig = ref({
  type: 'report',
  accessToken: '',
  embedUrl: '',
  uniqueId: '',
  settings: {
    filterPaneEnabled: false,
    navContentPaneEnabled: true,
  },
  tokenType: models.TokenType.Embed,
})

const handleViewReportFullscreen = async (
  accountId: number,
  reportLabel: string,
  embeddedReportId: string,
  embeddedReportUrl: string,
) => {
  try {
    selectedReportLabel.value = reportLabel
    powerBIConfig.value.uniqueId = embeddedReportId
    powerBIConfig.value.embedUrl = embeddedReportUrl
    powerBIConfig.value.accessToken = await fetchBIToken(embeddedReportId, accountId)

    openReportFullscreen()
  } catch {
    logger.trace('Report Fullscreen - BI report loading failed. Please try again later.')
    displayNotification('error', t('biReportLoadingError'))
  }
}
// #endregion

// #region report deletion
const selectedReportName = ref('')
const selectedReportEmbedId = ref('')
const isReportDeletionDialogVisible = ref(false)

const handleDeleteReport = async (
  embeddedReportId: string,
  reportName: string,
) => {
  selectedReportName.value = reportName
  selectedReportEmbedId.value = embeddedReportId
  isReportDeletionDialogVisible.value = true
}

const handleReportDeletion = async (deleteOption: ReportDeleteOption) => {
  try {
    await deleteBIReport(selectedReportEmbedId.value, deleteOption)
    await Promise.all([
      fetchReportsData(),
      fetchReportStatisticsData(),
    ])

    const deleteOptionKey = deleteOption === ReportDeleteOption.ALL ? 'all' : 'platformOnly'
    displayNotification(
      'success',
      t('notification.reportDeleted', {
        reportName: selectedReportName.value,
        destination: t(`notification.deleteOptions.${deleteOptionKey}`),
      }),
    )
  } catch {
    logger.trace('Report Deletion - Failed to delete BI report. Please try again later.')
    displayNotification('error', t('notification.reportDeletionError'))
  } finally {
    isReportDeletionDialogVisible.value = false
  }
}
// #endregion

onMounted(() => {
  fetchReportsData()
  fetchReportStatisticsData()
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
  activated: 'activated'
  deactivated: 'deactivated'
  manualUpload: 'Upload Manually'
  statusChange: 'The report {reportName} has been successfully {action}.'
  biReportLoadingError: "The BI report can't be loaded at the moment. Please try again later."
  notification:
    reportDeleted: "{reportName} has been deleted {destination}."
    deleteOptions:
      all: "from the Platform and Power BI Services Workspace"
      platformOnly: "from the Platform only"
    reportDeletionError: "An error occurred while deleting the report. Please try again later."
  errors:
    reportErrorsFetch: >
      We couldn't load the report errors. Please check your connection or try again shortly.
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
  activated: 'activé'
  deactivated: 'désactivé'
  manualUpload: 'Déposer manuellement'
  statusChange: 'Le rapport {reportName} a été {action} avec succès.'
  biReportLoadingError: 'Le rapport BI ne peut pas être chargé pour le moment. Merci de réessayer plus tard.'
  notification:
    reportDeleted: "{reportName} a été supprimé {destination}."
    deleteOptions:
      all: "de la Plateforme et le Workspace Power BI Services"
      platformOnly: "de la Plateforme uniquement"
    reportDeletionError: "Une erreur est survenue lors de la suppression du rapport. Veuillez réessayer plus tard."
  errors:
    reportErrorsFetch: >
      Nous n'avons pas pu charger les erreurs de rapport.
      Veuillez vérifier votre connexion ou réessayer dans un instant.
    reportActivation: >
      Une erreur est survenue lors de l'activation du rapport. Veuillez réessayer ou contacter le support
      si le problème persiste.
    reportDeactivation: >
      Une erreur est survenue lors de la désactivation du rapport. Merci de réessayer ultérieurement ou de
      contacter notre équipe d'assistance.
    reportFetch: >
      Nous n'avons pas pu charger les rapports. Vérifiez votre connexion ou réessayez dans quelques instants.
</i18n>
