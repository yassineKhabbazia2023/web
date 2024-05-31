<template>
  <div class="bi-reports">
    <div
      v-if="isLoading"
      class="flex flex--justify-content-center margin-y--4"
      data-testid="bi-reports-loader"
    >
      <PLoader pType="primary" pSize="50" />
    </div>
    <template v-else>
      <ReportsList
        v-if="selectedReport"
        :reports="reports"
        v-model:selectedReport="selectedReport"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { PLoader } from '@kpmg/styleguide'
import { fetchBIReports } from '@/services/reporting'
import type { Report } from './BIReportsTypes'
import ReportsList from './components/ReportsList'

const route = useRoute()
const isLoading = ref(true)
const reports = ref<Report[]>([])
const selectedReport = ref<Report>()

// ℹ️ No unit tests for now because we will improve this component in the next PR
onMounted(async () => {
  try {
    const accountId = +route.params.id
    const { items } = await fetchBIReports(accountId)
    reports.value = items
    // We always select the first report
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
