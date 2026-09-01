<template>
  <div class="agents-dashboard-page">
    <div
      class="
        padding-y--2
        padding-x--6
        padding-bottom--0
      "
    >
      <div
        class="
          flex
          flex--align-items-center
          flex--justify-content-space-between
          flex-gap--4
        "
      >
        <div>
          <h1
            class="
              font-large
              font-bold
              text-color--black-rock-900
            "
            data-testid="agents-dashboard-page-title"
          >
            Dashboard agents
          </h1>
          <p class="text-color--neutral-gray-500 font-small">
            Suivi des verrous posés sur les agents Azure DevOps
          </p>
        </div>

        <CreateAgentLock
          :environments
          :isLoading="isLoadingFilters"
          @lock-created="initialize"
        />
      </div>
    </div>

    <div class="padding--6">
      <div
        class="
          bg--base-white
          border-radius--2
          shadow--2
          padding--4
          margin-bottom--8
        "
      >
        <AgentsDashboardFilters
          v-model:filters="filters"
          :environments
          :isLoading
          :isLoadingFilters
          @filter-change="handleFilterChange"
          @reset-filters="resetFilters"
        />
      </div>

      <div
        class="
          agents-dashboard-page__table-container
          bg--base-white
          border-radius--2
          shadow--2
          padding--4
        "
      >
        <AgentsDashboardTable
          :locks
          :totalCount="pagination.totalCount"
          :currentPage="pagination.currentPage"
          :pageSize="pagination.pageSize"
          :isLoading
          @page-change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAgentsDashboard } from '@backoffice/composables/use-agents-dashboard.composable'
import AgentsDashboardFilters from './agents-dashboard-filters/agents-dashboard-filters.vue'
import AgentsDashboardTable from './agents-dashboard-table/agents-dashboard-table.vue'
import CreateAgentLock from './create-agent-lock/create-agent-lock.vue'

const {
  locks,
  environments,
  isLoading,
  isLoadingFilters,
  filters,
  pagination,
  handlePageChange,
  handlePageSizeChange,
  handleFilterChange,
  resetFilters,
  initialize,
} = useAgentsDashboard()

onMounted(() => {
  initialize()
})
</script>
