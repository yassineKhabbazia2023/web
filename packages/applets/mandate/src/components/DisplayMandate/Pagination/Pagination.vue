<template>
  <PPagination
    :pShowTotalPageCounter="showTotalPageCounter"
    :pPageSizes="pagesRanges"
    :pTotal="pagesCount"
    :pPageSizeSelectorSuffix="pageRangeSelectorSuffix"
    :pPageSizeSelectorGroupLabel="pageRangeSelectorGroupLabel"
    @update:p-current-page="handleCurrentChange"
    @on-page-range-changed="handleSizeChange"
    :pPageSize="limit"
    pTestIdRoot="mandate"
    :pCurrentPage="currentPage"
  >
    <p>{{`${startIndex} - ${endIndex}`}} {{t('on')}} {{pagesCount}}</p>
  </PPagination>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PaginationProps } from './PaginationTypes'
import { PPagination } from '@kpmg/styleguide'
import type { SearchMandateParams } from '@/services/mandate/ServiceMandateTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emit = defineEmits<{
  'page-selected': [Partial<SearchMandateParams>]
}>()

const props = withDefaults(defineProps<PaginationProps>(), {
  pageRangeSelectorSuffix: '',
  pageRangeSelectorGroupLabel: ' ',
  currentPage: 1,
})

const limit = ref(props.pagesRanges[0])

const startIndex = computed(() => {
  if (props.pagesCount > 0) {
    return (((props.currentPage - 1) * limit.value) + 1)
  }
  return 0
})
const endIndex = computed(() => {
  if (((startIndex.value - 1) + limit.value) >= props.pagesCount) {
    return props.pagesCount
  }
  return startIndex.value - 1 + limit.value
})

const handleCurrentChange = (currentPage: number) => {
  updateListDisplay(currentPage, limit.value)
}

const handleSizeChange = (currentItemsByPage: number) => {
  limit.value = currentItemsByPage
  updateListDisplay(1, limit.value)
}

function updateListDisplay(currentPage: number, limit: number) {
  emit('page-selected', { currentPage, limit })
}
</script>

<i18n lang="yaml">
  en-US:
      on: 'on'
  fr-FR:
    on: 'sur'
</i18n>
