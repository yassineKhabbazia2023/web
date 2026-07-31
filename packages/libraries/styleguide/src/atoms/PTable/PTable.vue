<template>
  <ElTable
    ref="table"
    :data="pData"
    :stripe="pStripe"
    :rowClassName="tableRowClassName"
    :fit="pFit"
    :header-cell-style="pHeaderCellStyle"
    :cell-style="pCellStyle"
    :row-key="pRowKey"
    :default-sort="pDefaultSort"
    :data-testid="pTestId"
  >
    <slot />
    <template #empty>
      <PTableNoData
        :pEmptyText="pEmptyText"
        :pIconName="pEmptyIconName"
        :pActionLabel="pEmptyActionLabel"
        @action-click="$emit('empty-action-click')"
      />
    </template>
  </ElTable>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElTable } from 'element-plus'
import PTableNoData from '../PTableNoData'
import type { PTableProps } from './PTableTypes'

/* NOTE : un usage de pfit est fait dans la story et la question
de son usage se pose car via cet emplacement ne se bind nul part */
const table = ref<any>()

defineEmits<{
  (e: 'empty-action-click'): void
}>()

withDefaults(defineProps<PTableProps>(), {
  pStripe: false,
  pFit: true,
  pRowKey: undefined,
  pEmptyText: 'Aucune donnée',
  pEmptyIconName: 'infoCircle',
  pTestId: undefined,
})

// handle row selection background color not implemented by element plus
const tableRowClassName = ({ row, rowIndex } : { row: any, rowIndex: number }) => {
  // complete data of the rows with them index
  // in order to match true when getting getSelectionRows values
  row._rowIndex = rowIndex
  if (table.value &&
        table.value
          .getSelectionRows()
          .map((r: any) => r._rowIndex)
          .indexOf(row._rowIndex) > -1) {
    return 'p-table__row--selected'
  }

  return ''
}
</script>
