<template>
  <div
    v-if="isLoading"
    class="loader flex flex--justify-content-center flex--align-items-center"
    data-testid="bi-reports-loader"
  >
    <PLoader pType="primary" pSize="50" />
  </div>
  <div v-else-if="!isLoading && selectedReport" class="bi-reports flex">
    <ReportsList :reports="reports" v-model:selectedReport="selectedReport" />
    <ReportDisplay :selectedReport="selectedReport" :token="powerBiToken" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { PLoader } from '@kpmg/styleguide'
import { fetchBIReports, fetchBIToken } from '@entities/services/reporting'
import type { Report } from './BIReportsTypes'
import ReportsList from './components/ReportsList'
import ReportDisplay from './components/ReportDisplay'

const route = useRoute()
const isLoading = ref(true)
const reports = ref<Report[]>([])
const powerBiToken = ref<string>('')
const selectedReport = ref<Report>()

onMounted(async () => {
  try {
    const accountId = +route.params.id
    const { items } = await fetchBIReports(accountId)
    powerBiToken.value = await fetchBIToken()
    reports.value = items
    // We always select the first report by default
    selectedReport.value = reports.value[0]
  } catch (error) {
    console.error('Unable to fetch BI reports: ', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped lang="scss">
.bi-reports {
  height: calc(100vh - 56px);
}
</style>
