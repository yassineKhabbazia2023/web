<template>
  <PPagination
    :pShowTotalPageCounter="showTotalPageCounter"
    :pPageSizes="pagesRanges"
    :pTotal="pagesCount"
    :pPageSizeSelectorSuffix="pageRangeSelectorSuffix"
    :pPageSizeSelectorGroupLabel="pageRangeSelectorGroupLabel"
    @update:p-current-page="handleCurrentChange"
    @on-page-range-changed="handleSizeChange"
    :pPageSize="itemsByPage"
    pTestIdRoot="mandate"
    :pCurrentPage="currentPage"
  >
    <p>{{`${startIndex} - ${endIndex}`}} {{t('on')}} {{pagesCount}}</p>
  </PPagination>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PaginationProps } from './Pagination'
import { PPagination } from '@kpmg/styleguide'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emit = defineEmits(['page-selected'])
const props = withDefaults(defineProps<PaginationProps>(), {
  pageRangeSelectorSuffix: '',
  pageRangeSelectorGroupLabel: ' ',
  currentPage: 1,
})

const itemsByPage = ref(props.pagesRanges[0])

const startIndex = computed(() => {
  if (props.pagesCount > 0) {
    return (((props.currentPage - 1) * itemsByPage.value) + 1)
  }
  return 0
})
const endIndex = computed(() => {
  if (((startIndex.value - 1) + itemsByPage.value) >= props.pagesCount) {
    return props.pagesCount
  }
  return startIndex.value - 1 + itemsByPage.value
})

const handleCurrentChange = (currentPage: number) => {
  updateListDisplay(currentPage, itemsByPage.value)
}

const handleSizeChange = (currentItemsByPage: number) => {
  itemsByPage.value = currentItemsByPage
  updateListDisplay(props.currentPage, itemsByPage.value)
}

const updateListDisplay = (currentPage: number, itemsByPage: number) =>
  emit('page-selected', { currentPage, itemsByPage })

</script>

<i18n lang="yaml">
  en-US:
    on: 'on'
  fr-FR:
    on: 'sur'
</i18n>

