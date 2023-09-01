<template>
  <div class="p-pagination">
    <div class="p-pagination__select">
      <PDropdown v-model="selectedRange" placement="top">
        <POptionGroup :label="pageRangeSelectorGroupLabel">
          <POption
            v-for="pageRange in pagesRanges"
            :key="pageRange"
            :value="pageRange"
          >
            {{ getPageRangeSelectorContent(pageRange) }}
          </POption>
        </POptionGroup>
      </PDropdown>
    </div>
    <el-pagination v-bind="$attrs" layout="prev, pager, next" />
    <div class="p-pagination__total-page-counter" v-if="showTotalPageCounter">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElPagination } from 'element-plus'

export interface PaginationProps {
  showTotalPageCounter: boolean
  pagesRanges: Array<number>
  pageRangeSelectorGroupLabel: string
  pageRangeSelectorSuffix: string
}

const props = defineProps<PaginationProps>()

const emit = defineEmits(['on-page-range-changed'])

const selectedRange = ref(props.pagesRanges[0] ?? '')

const getPageRangeSelectorContent = (pageRange: number) => {
  return pageRange + ' ' + props.pageRangeSelectorSuffix
}

watch(selectedRange, () => {
  emit('on-page-range-changed', selectedRange)
})
</script>
