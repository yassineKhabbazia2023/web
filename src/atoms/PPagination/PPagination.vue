<template>
  <div class="p-pagination">
    <div class="p-pagination__select">
      <ElSelect v-model="selectedRange" placement="top">
        <ElOptionGroup :label="pageSizeSelectorGroupLabel">
          <ElOption
            v-for="pageSize in pageSizes"
            :key="pageSize"
            :value="pageSize"
          >
            {{ getpageSizeSelectorContent(pageSize) }}
          </ElOption>
        </ElOptionGroup>
      </ElSelect>
    </div>
    <ElPagination v-bind="$attrs" layout="prev, pager, next" />
    <ElPagination v-bind="$attrs" layout="prev, pager, next" />
    <div class="p-pagination__total-page-counter" v-if="showTotalPageCounter">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElPagination } from 'element-plus'
import { PDropdown } from '@/atoms/PDropdown'

export interface PaginationProps {
  showTotalPageCounter: boolean
  pagesRanges: Array<number>
  pageRangeSelectorGroupLabel: string
  pageRangeSelectorSuffix: string
}

const props = defineProps<PaginationProps>()

const emit = defineEmits(['on-page-range-changed'])

const selectedRange = ref(props.pageSizes[0] ?? '')

const getpageSizeSelectorContent = (pageSize: number) => {
  return pageSize + ' ' + props.pageSizeSelectorSuffix
}

watch(selectedRange, () => {
  emit('on-page-range-changed', selectedRange.value)
})
</script>
