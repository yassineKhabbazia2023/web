<template>
  <div class="p-pagination">
    <div class="p-pagination__select">
      <PSelect v-model="selectedRange" placement="top">
        <POptionGroup :label="pPageSizeSelectorGroupLabel">
          <POption
            v-for="pageSize in pPageSizes"
            :key="pageSize"
            :value="pageSize"
          >
            {{ getpageSizeSelectorContent(pageSize) }}
          </POption>
        </POptionGroup>
      </PSelect>
    </div>

    <ElPagination
      v-model:current-page="currentPage"
      v-model:page-size="modelPageSize"
      :background="pBackground"
      :pageSizes="pPageSizes"
      :total="pTotal"
      layout="prev, pager, next"
    />

    <div v-if="pShowTotalPageCounter" class="p-pagination__total-page-counter">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import {
  ElOption as POption,
  ElOptionGroup as POptionGroup,
  ElPagination,
  ElSelect as PSelect,
} from 'element-plus'
import type { PaginationProps } from './PPaginationTypes'

const props = withDefaults(defineProps<PaginationProps>(), {
  pBackground: false,
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
  },
})

const selectedRange = ref(props.pPageSizes ? props.pPageSizes?.at(0) : '')

const getpageSizeSelectorContent = (pageSize: number) => {
  return `${pageSize} ${props.pPageSizeSelectorSuffix}`
}

watch(selectedRange, () => {
  emit('on-page-range-changed', selectedRange.value)
})
</script>
