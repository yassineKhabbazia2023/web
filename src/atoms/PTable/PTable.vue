<template>
  <el-table
    :data="data"
    :stripe="stripe"
    :rowClassName="tableRowClassName"
    ref="table"
  >
    <slot />
  </el-table>
</template>

<script lang="ts" setup>
import { ElTable } from 'element-plus'
import { ref } from 'vue'

const table = ref<InstanceType<typeof ElTable>>()

type PTableProps = {
  data: any[]
  stripe: boolean
}

withDefaults(defineProps<PTableProps>(), {
  data: () => [],
  stripe: true
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
