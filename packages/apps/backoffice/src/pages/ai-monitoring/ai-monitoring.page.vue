<template>
  <div class="ai-monitoring-page">
    <div
      class="
        padding-y--2
        padding-x--6
        padding-bottom--0
      "
    >
      <h1
        class="
          font-large
          font-bold
          text-color--black-rock-900
        "
        data-testid="ai-monitoring-page-title"
      >
        Dashboard Monitoring IA
      </h1>
      <p class="text-color--neutral-gray-500 font-small">
        Suivi des performances et de l'utilisation des fonctionnalités IA de la plateforme digitale
      </p>
    </div>

    <div class="padding--6">
      <div
        class="
          bg--base-white
          border-radius--2
          shadow--2
          padding--4
        "
      >
        <AiMonitoringFilters
          v-model:filters="filters"
          :features="filterFeatures"
          :users="filterUsers"
          :isLoading="isLoadingFilters"
          @filter-change="handleFilterChange"
          @reset-filters="resetFilters"
        />
      </div>

      <AiMonitoringStats
        :summary="summary"
        :isLoading="isLoadingSummary"
        class="margin-y--8"
      />

      <div
        class="
          ai-monitoring-page__table-container
          bg--base-white
          border-radius--2
          shadow--2
          padding--4
        "
      >
        <AiMonitoringTable
          :history="history"
          :totalItems="pagination.totalItems"
          :currentPage="pagination.currentPage"
          :pageSize="pagination.pageSize"
          :isLoading="isLoading"
          @page-change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAiMonitoring } from '@backoffice/composables/use-ai-monitoring.composable'
import AiMonitoringFilters from './ai-monitoring-filters/ai-monitoring-filters.vue'
import AiMonitoringStats from './ai-monitoring-stats/ai-monitoring-stats.vue'
import AiMonitoringTable from './ai-monitoring-table/ai-monitoring-table.vue'

const {
  history,
  summary,
  isLoading,
  isLoadingFilters,
  isLoadingSummary,
  pagination,
  filters,
  filterFeatures,
  filterUsers,
  handlePageChange,
  handlePageSizeChange,
  handleFilterChange,
  resetFilters,
  initialize,
} = useAiMonitoring()

onMounted(() => {
  initialize()
})
</script>
