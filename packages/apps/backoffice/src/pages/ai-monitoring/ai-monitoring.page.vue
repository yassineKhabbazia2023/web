<template>
  <div class="ai-monitoring-page">
    <div class="padding-y--2 padding-x--6 padding-bottom--0">
      <h1
        class="font-large font-bold text-color--black-rock-900"
        data-testid="ai-monitoring-page-title"
      >
        Dashboard Monitoring IA
      </h1>
      <p class="text-color--neutral-gray-500 font-small">
        Suivi des performances et de l'utilisation des fonctionnalités IA de la plateforme digitale
      </p>
    </div>

    <div class="padding--6">
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
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAiMonitoring } from '@backoffice/composables/use-ai-monitoring.composable'
import AiMonitoringTable from './ai-monitoring-table/ai-monitoring-table.vue'

const {
  history,
  isLoading,
  pagination,
  handlePageChange,
  handlePageSizeChange,
  initialize,
} = useAiMonitoring()

onMounted(() => {
  initialize()
})
</script>
