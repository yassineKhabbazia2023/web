<template>
  <PTable
    :pData="workItems"
    pSize="small"
    :pRowClassName="getRowClassName"
  >
    <PTableColumn
      pProp="id"
      pLabel="ID"
      pWidth="100"
    >
      <template #default="{ row }">
        <a
          :href="row.webUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="mep-planner-work-items-table__link"
        >
          {{ row.id }}
        </a>
      </template>
    </PTableColumn>

    <PTableColumn
      pProp="title"
      pLabel="Titre"
      pMinWidth="300"
    />

    <PTableColumn
      pProp="team"
      pLabel="Team"
      pWidth="120"
    />

    <PTableColumn
      pProp="type"
      pLabel="Type"
      pWidth="140"
    >
      <template #default="{ row }">
        <PTag
          :pColor="getTypeColor(row.type)"
          :pContent="row.type"
          pSize="small"
        />
      </template>
    </PTableColumn>

    <PTableColumn
      pProp="state"
      pLabel="État"
      pWidth="120"
    >
      <template #default="{ row }">
        <PTag
          :pColor="getStateColor(row.state)"
          :pContent="row.state"
          pSize="small"
        />
      </template>
    </PTableColumn>
  </PTable>
</template>

<script setup lang="ts">
import {
  PTable,
  PTableColumn,
  PTag,
} from '@pulse/styleguide/components'
import type { WorkItem } from '@backoffice/types/azure-devops.type'
import {
  getTypeColor,
  getStateColor,
  getRowClassName,
} from './mep-planner-work-items-table.helper'

defineProps<{
  workItems: WorkItem[]
}>()
</script>

<style scoped lang="scss">
.mep-planner-work-items-table {
  &__link {
    color: var(--el-color-primary);
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }

  :deep(.mep-planner-work-items-table__row--incomplete) {
    background-color: var(--el-color-danger-light-9);
  }
}
</style>
