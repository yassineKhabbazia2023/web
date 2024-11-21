<template>
  <div class="p-pagination">
    <div class="p-pagination__select">
      <ElSelect
        v-model="modelPageSize"
        placement="top"
        :data-testid="`${pTestIdRoot}-pagination-select`"
      >
        <ElOptionGroup :label="pPageSizeSelectorGroupLabel">
          <ElOption
            v-for="pageSize in pPageSizes"
            :key="pageSize"
            :value="pageSize"
          >
            {{ getpageSizeSelectorContent(pageSize) }}
          </ElOption>
        </ElOptionGroup>
      </ElSelect>
    </div>

    <ElPagination
      v-model:current-page="currentPage"
      v-model:page-size="modelPageSize"
      :background="pBackground"
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
import {
  ElOption,
  ElOptionGroup,
  ElPagination,
  ElSelect,
} from 'element-plus'
import type { PaginationProps } from './PPaginationTypes'

const props = withDefaults(defineProps<PaginationProps>(), {
  pBackground: false,
  pTestIdRoot: 'ppagination',
})
const emit = defineEmits(['on-page-range-changed', 'update:pCurrentPage', 'update:pPageSize'])

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

const getpageSizeSelectorContent = (pageSize: number) => {
  return `${pageSize} ${props.pPageSizeSelectorSuffix}`
}
</script>
