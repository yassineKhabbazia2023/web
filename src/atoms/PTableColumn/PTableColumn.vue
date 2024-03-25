<template>
  <ElTableColumn
    :type="pType"
    :index="pIndex"
    :label="pLabel"
    :columnKey="pColumnKey"
    :prop="pProp"
    :width="pWidth"
    :minWidth="pMinWidth"
    :fixed="pFixed"
    :renderHeader="pRenderHeader"
    :sortable="pSortable"
    :sortMethod="pSortMethod"
    :sortBy="pSortBy"
    :sortOrders="pSortOrders"
    :resizable="pResizable"
    :formatter="pFormatter"
    :showOverflowTooltip="pShowOverflowTooltip"
    :align="pAlign"
    :headerAlign="pHeaderAlign"
    :className="pClassName"
    :labelClassName="pLabelClassName"
    :selectable="pSelectable"
    :reserveSelection="pReserveSelection"
    :filters="pFilters"
    :filterPlacement="pFilterPlacement"
    :filterMultiple="pFilterMultiple"
    :filterMethod="pFilterMethod"
    :filteredValue="pFilteredValue"
  >
    <template v-if="!!slots['default']" #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </ElTableColumn>
</template>

<script lang="ts" setup>
import { useSlots } from 'vue'
import { ElTableColumn } from 'element-plus'
import type { PTableColumnProps } from './PTableColumnTypes'

const slots = useSlots()
withDefaults(defineProps<PTableColumnProps>(), {
  pType: undefined,
  pIndex: undefined,
  pLabel: undefined,
  pColumnKey: undefined,
  pProp: undefined,
  pWidth: undefined,
  pMinWidth: undefined,
  pFixed: undefined,
  pRenderHeader: undefined,
  pSortable: false,
  pSortMethod: undefined,
  pSortBy: undefined,
  pSortOrders: () => ['ascending', 'descending', null],
  pResizable: true,
  pFormatter: undefined,
  pShowOverflowTooltip: undefined,
  pAlign: 'left',
  pHeaderAlign: undefined,
  pClassName: undefined,
  pLabelClassName: undefined,
  pSelectable: undefined,
  pReserveSelection: false,
  pFilters: undefined,
  pFilterPlacement: undefined,
  pFilterMultiple: true,
  pFilterMethod: undefined,
  pFilteredValue: undefined,
})
</script>
