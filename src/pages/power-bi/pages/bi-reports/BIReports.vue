<template>
  <div
    v-if="isLoading"
    class="flex flex--justify-content-center margin-y--4"
    data-testid="bi-reports-loader"
  >
    <PLoader pType="primary" pSize="50" />
  </div>
  <div v-else-if="!isLoading && selectedReport" class="bi-reports flex">
    <ReportsList :reports="reports" v-model:selectedReport="selectedReport" />
    <ReportDisplay :selectedReport="selectedReport" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { PLoader } from '@kpmg/styleguide'
import { fetchBIReports } from '@/services/reporting'
import type { Report } from './BIReportsTypes'
import ReportsList from './components/ReportsList'
import ReportDisplay from './components/ReportDisplay'

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
