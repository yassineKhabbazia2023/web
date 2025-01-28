<template>
  <div
    v-if="isLoading"
    class="loader flex flex--justify-content-center flex--align-items-center"
    data-testid="bi-reports-loader"
  >
    <PLoader pType="primary" pSize="50" />
  </div>
  <div v-else-if="!isLoading && selectedReport" class="bi-reports flex">
    <ReportsList v-model:selectedReport="selectedReport" :reports="reports" />
    <ReportDisplay :selectedReport="selectedReport" />
  </div>
</template>

<script setup lang="ts">
import { logger } from '@pulse/core'
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { PLoader } from '@pulse/styleguide/components'
import { fetchBIReports } from '@entities/services/reporting'
import type { Report } from './BIReportsTypes'
import ReportsList from './components/ReportsList'
import ReportDisplay from './components/ReportDisplay'
import { displayNotification } from '@entities/common/utils'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const route = useRoute()
const isLoading = ref(true)
const reports = ref<Report[]>([])
const selectedReport = ref<Report>()

onMounted(async () => {
  try {
    const accountId = +route.params.id
    const { items } = await fetchBIReports(accountId)
    reports.value = items
    // We always select the first report by default
    selectedReport.value = reports.value[0]
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
    biReportsUnavailable: "Un problème technique empêche la récupération des rapports BI. Merci de vérifier plus tard."
</i18n>
