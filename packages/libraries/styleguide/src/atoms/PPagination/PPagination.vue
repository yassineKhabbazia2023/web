<template>
  <div class="p-pagination">
    <PDropdown
      v-if="!pHidePageSize"
      v-model="modelPageSize"
      :pOptions="pageSizeOptions"
      pPlacement="top"
      :data-testid="`${pTestIdRoot}-pagination-select`"
      popper-class="p-pagination__popper"
      class="p-pagination__select"
    />

    <ElPagination
      v-model:current-page="currentPage"
      v-model:page-size="modelPageSize"
      background
      :pageSizes="pPageSizes"
      :total="pTotal"
      layout="prev, pager, next"
      :data-testid="`${pTestIdRoot}-pagination-pages`"
    />

    <div
      v-if="pShowTotalPageCounter"
      class="p-pagination__total-page-counter"
      :data-testid="`${pTestIdRoot}-pagination-counter`"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElPagination } from 'element-plus'
import type { PaginationProps } from './PPaginationTypes'
import PDropdown from '../../molecules/PDropdown'
import type { PDropdownProps } from '../../molecules/PDropdown/PDropdownTypes'

const props = withDefaults(defineProps<PaginationProps>(), {
  pTestIdRoot: 'ppagination',
})
const emit = defineEmits(['on-page-range-changed', 'update:pCurrentPage', 'update:pPageSize'])

const pageSizeOptions = computed<PDropdownProps['pOptions']>(() => (
  (props.pPageSizes ?? [])
    .map((pageSize) => ({
      pValue: pageSize,
      pLabel: `${pageSize} ${props.pPageSizeSelectorSuffix}`,
      pGroupLabel: props.pPageSizeSelectorGroupLabel,
    }))
))

const currentPage = computed({
  get() {
    return props.pCurrentPage
  },
  set(value) {
    emit('update:pCurrentPage', value)
  },
})

const modelPageSize = computed({
  get() {
    return props.pPageSize
  },
  set(value) {
    emit('update:pPageSize', value)
    emit('on-page-range-changed', value)
  },
})
</script>
