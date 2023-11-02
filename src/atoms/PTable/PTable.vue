<template>
  <ElTable
    :data="pData"
    :stripe="pStripe"
    :rowClassName="tableRowClassName"
    ref="table"
  >
    <slot />
  </ElTable>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElTable } from 'element-plus'
import type { PTableProps } from './PTableTypes'

/* NOTE : un usage de pfit est fait dans la story et la question
de son usage se pose car via cet emplacement ne se bind nul part */
const table = ref<any>()

withDefaults(defineProps<PTableProps>(), {
  pData: () => [],
  pStripe: true
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
