<template>
  <div class="p-pagination">
    <div class="p-pagination__select">
      <PSelect v-model="selectedRange" placement="top">
        <POptionGroup :label="pageSizeSelectorGroupLabel">
          <POption
            v-for="pageSize in pageSizes"
            :key="pageSize"
            :value="pageSize"
          >
            {{ getpageSizeSelectorContent(pageSize) }}
          </POption>
        </POptionGroup>
      </PSelect>
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
import {
  ElOption as POption,
  ElOptionGroup as POptionGroup,
  ElPagination,
  ElSelect as PSelect
} from 'element-plus'

export interface PaginationProps {
  showTotalPageCounter: boolean
  pageSizes: Array<number>
  pageSizeSelectorGroupLabel: string
  pageSizeSelectorSuffix: string
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
