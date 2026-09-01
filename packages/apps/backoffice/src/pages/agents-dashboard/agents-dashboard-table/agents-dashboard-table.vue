<template>
  <div
    v-if="isLoading === true"
    class="
      agents-dashboard-table__loader
      flex
      flex--direction-column
      flex--align-items-center
      flex--justify-content-center
      flex-gap--4
    "
  >
    <PLoader
      pType="no-color"
      pSize="60"
    />
    <p class="text-color--neutral-gray-500 font-small text-center margin-top--4">
      Chargement des verrous agents...
    </p>
  </div>

  <template v-else>
    <PTable
      v-if="locks.length > 0"
      pTestId="agents-dashboard-table"
      :pData="locks"
      pEmptyText="Aucun verrou agent disponible"
      class="width--100 border-radius--2"
      pStripe
      :pCellStyle="{ padding: '12px 0px' }"
      :pRowKey="getRowKey"
    >
      <PTableColumn
        pTestId="agents-dashboard-table-status-column"
        pLabel="Statut"
        pWidth="140px"
      >
        <template #default="{ row }">
          <PTag
            pSize="default"
            :pColor="getLockStatusColor(row.isLocked)"
            :pContent="getLockStatusLabel(row.isLocked)"
          />
        </template>
      </PTableColumn>

      <PTableColumn
        pTestId="agents-dashboard-table-environment-column"
        pLabel="Environnement"
        pMinWidth="160px"
      >
        <template #default="{ row }">
          <div class="flex flex--direction-column">
            <span class="font-medium">{{ row.environmentName }}</span>
            <span class="font-small text-color--neutral-gray-500">{{ row.environment }}</span>
          </div>
        </template>
      </PTableColumn>

      <PTableColumn
        pTestId="agents-dashboard-table-locked-by-column"
        pLabel="Verrouillé par"
        pMinWidth="160px"
      >
        <template #default="{ row }">
          <span>{{ formatNullableText(row.lockedBy) }}</span>
        </template>
      </PTableColumn>

      <PTableColumn
        pTestId="agents-dashboard-table-created-at-column"
        pLabel="Créé le"
        pMinWidth="170px"
      >
        <template #default="{ row }">
          <span>{{ formatDateTime(row.createdAt) }}</span>
        </template>
      </PTableColumn>

      <PTableColumn
        pTestId="agents-dashboard-table-expires-at-column"
        pLabel="Expire le"
        pMinWidth="170px"
      >
        <template #default="{ row }">
          <span>{{ row.expiresAt !== null ? formatDateTime(row.expiresAt) : '-' }}</span>
        </template>
      </PTableColumn>

      <PTableColumn
        pTestId="agents-dashboard-table-reason-column"
        pLabel="Motif"
        pMinWidth="220px"
      >
        <template #default="{ row }">
          <span>{{ formatNullableText(row.reason) }}</span>
        </template>
      </PTableColumn>

      <PTableColumn
        pTestId="agents-dashboard-table-unlocked-by-column"
        pLabel="Déverrouillé par"
        pMinWidth="170px"
      >
        <template #default="{ row }">
          <span>{{ formatNullableText(row.unlockedBy) }}</span>
        </template>
      </PTableColumn>
    </PTable>

    <div
      v-else
      class="
        flex
        flex--direction-column
        flex--align-items-center
        flex--justify-content-center
        flex-gap--4
        padding--16
      "
    >
      <PIcon
        pName="lock"
        pSize="48"
        color="var(--el-text-color-placeholder)"
      />
      <p class="text-color--neutral-gray-500 font-small text-center">
        Aucun verrou agent disponible
      </p>
    </div>

    <PPagination
      v-if="locks.length > 0"
      pTestId="agents-dashboard-table-pagination"
      class="margin-top--8"
      :pCurrentPage="currentPage"
      :pPageSize="pageSize"
      :pTotal="totalCount"
      :pPageSizes="[10, 25, 50, 100]"
      pPageSizeSelectorSuffix=""
      pShowTotalPageCounter
      @on-page-range-changed="handlePageSizeChange"
      @update:p-current-page="handlePageChange"
    >
      <p>{{ paginationLabel }}</p>
    </PPagination>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PIcon, PLoader, PPagination, PTable, PTableColumn, PTag } from '@pulse/styleguide/components'
import { getPaginationLabel } from '@pulse/common/utils'
import { formatDateTime } from '@pulse/toolbox/utils/dates'
import type { AgentLockItem } from '@backoffice/types/agents-dashboard.type'
import type { AgentsDashboardTableProps } from './agents-dashboard-table.type'
import {
  formatNullableText,
  getLockStatusColor,
  getLockStatusLabel,
} from './agents-dashboard-table.utils'

const {
  locks,
  totalCount,
  currentPage,
  pageSize,
  isLoading,
} = defineProps<AgentsDashboardTableProps>()

const emit = defineEmits<{
  'page-change': [page: number]
  'page-size-change': [pageSize: number]
}>()

const paginationLabel = computed(() =>
  getPaginationLabel('sur', {
    currentPage,
    limit: pageSize,
    data: locks,
    totalItems: totalCount,
  }),
)

const getRowKey = (row: AgentLockItem): string => {
  return row.id
}

const handlePageChange = (page: number) => {
  emit('page-change', page)
}

const handlePageSizeChange = (newPageSize: number) => {
  emit('page-size-change', newPageSize)
}
</script>

<style scoped lang="scss">
.agents-dashboard-table__loader {
  min-height: 400px;
}
</style>
