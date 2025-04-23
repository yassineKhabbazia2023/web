<template>
  <div>
    <ReportTable
      :reports="reports"
      data-testid="bi-reports-list-table"
    />
    <PPagination
      v-model:p-page-size="searchCriteria.limit"
      class="margin-top--6"
      :pCurrentPage="searchResult.currentPage"
      :pTotal="searchResult.totalItems"
      :pPageSizes="PAGE_SIZES"
      pPageSizeSelectorSuffix=""
      pShowTotalPageCounter
      data-testid="bi-reports-list-pagination"
    >
      <p>{{ paginationLabel }}</p>
    </PPagination>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, computed, shallowRef } from 'vue'
import { PPagination } from '@pulse/styleguide/components'
import { PAGE_SIZES } from '@entities/constants'
import type { ReportStatusTag, MappedReportRow } from '@entities/common/types/BIReportsTypes'
import { ReportStatus } from '@entities/common/types/BIReports.enums'
import { getMockReportTable } from '@entities/__mocks__/bi-report.mocks'
import { getPaginationLabel } from '@entities/helper'
import ReportTable from './components/ReportTable'
import { getMappedReport } from './utils'
import { SearchCriteria, SearchResult } from '../../types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const REPORT_STATUSES: Record<ReportStatus, ReportStatusTag> = {
  [ReportStatus.ONLINE]: {
    text: t('online'),
    color: 'success',
    iconName: 'checkCircle',
  },
  [ReportStatus.OFFLINE]: {
    text: t('offline'),
    color: 'gray-900',
    iconName: 'eyeSlash',
  },
  [ReportStatus.INITIALIZED]: {
    text: t('initialized'),
    color: 'info',
    iconName: 'stars',
  },
  [ReportStatus.FAILED]: {
    text: t('failed'),
    color: 'danger',
    iconName: 'exclamationTriangle',
  },
}

const reports = shallowRef<MappedReportRow[]>([])

// #region pagination
const searchCriteria = ref<SearchCriteria>({
  currentPage: 1,
  limit: PAGE_SIZES[0],
  search: '',
})

const searchResult = ref<SearchResult>({
  currentPage: 1,
  items: [],
  totalPage: 1,
  totalItems: 1,
})

const paginationLabel = computed(() =>
  getPaginationLabel(t('on'), {
    currentPage: searchCriteria.value.currentPage,
    limit: searchCriteria.value.limit,
    data: searchResult.value.items,
    totalItems: searchResult.value.totalItems,
  }),
)
// #endregion

onMounted(() => {
  const reportsMock = getMockReportTable()
  reports.value = getMappedReport(reportsMock, REPORT_STATUSES)
})
</script>

<i18n lang="yaml">
en-US:
  on: 'on'
  online: 'Online'
  offline: 'Offline'
  initialized: 'Initialized'
  failed: 'Failure'
  manualUpload: 'Upload Manually'
fr-FR:
  on: 'sur'
  online: 'En ligne'
  offline: 'Hors ligne'
  initialized: 'Initialisé'
  failed: 'Incident'
  manualUpload: 'Déposer manuellement'
</i18n>
