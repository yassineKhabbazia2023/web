<template>
  <div
    v-if="isLoading"
    class="loader flex flex--justify-content-center flex--align-items-center"
    data-testid="bi-reports-loader"
  >
    <PLoader pType="primary" pSize="50" />
  </div>
  <div v-else-if="!isLoading && selectedReport" class="bi-reports flex">
    <ReportsList
      :selectedReport="selectedReport"
      :reports="reports"
      @select-report="handleReportSelection"
    />
    <ReportDisplay :selectedReport="selectedReport" />
  </div>
</template>

<script setup lang="ts">
import { logger } from '@pulse/core'
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RouteParam } from '@pulse/common/enums'
import { RouterHelpers } from '@pulse/common/helpers'
import { PLoader } from '@pulse/styleguide/components'
import { displayNotification } from '@pulse/styleguide'
import { fetchBIReports } from '@powerbi/services/reporting.service'
import type { Report } from '@powerbi/types/bi-reports.types'

import ReportsList from '@powerbi/components/ReportsList/ReportsList.vue'
import ReportDisplay from '@powerbi/components/ReportDisplay/ReportDisplay.vue'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const isLoading = ref(true)
const reports = ref<Report[]>([])
const selectedReport = ref<Report>()

// #region manage reportId query
const route = useRoute()
const router = useRouter()

const selectReportById = (reportId: number): Report | undefined =>
  reports.value.find((report) => report.reportId === reportId)

const setQueryReportId = (reportId?: number) => {
  const query = { reportId }
  router.replace({ query })
}

const handleReportSelection = (reportId: number) => {
  const report = selectReportById(reportId)

  if (!report) {
    setQueryReportId()
    return
  }

  selectedReport.value = report
  setQueryReportId(reportId)
}
// #endregion

onMounted(async () => {
  try {
    const entityId = RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID)
    // entityId can't be null here, so we use non-null assertion
    const { items } = await fetchBIReports(entityId!)
    reports.value = items

    // Extract the reportId from the route's query parameters (handle both string and array cases)
    const rawReportId = Array.isArray(route.query.reportId) ? route.query.reportId[0] : route.query.reportId
    const reportId = Number(rawReportId)

    // If the reportId is not a valid number, reset the query and select the first available report
    if (!reportId || Number.isNaN(reportId)) {
      setQueryReportId()
      selectedReport.value = reports.value[0]
      logger.warn('Invalid reportId provided. Resetting to the first available report.')
      return
    }

    // If reportId is valid, proceed to handle report selection
    handleReportSelection(reportId)
  } catch (error) {
    logger.error(error)
    displayNotification('error', t('biReportsUnavailable'))
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped lang="scss">
.bi-reports {
  height: calc(100vh - 59px);
}
</style>

<i18n lang="yaml">
en-US:
  biReportsUnavailable: "There's a technical issue with fetching BI reports. Please check back later."
fr-FR:
  biReportsUnavailable: 'Un problème technique empêche la récupération des rapports BI. Merci de vérifier plus tard.'
</i18n>
