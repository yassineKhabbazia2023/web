<template>
  <PPagination
    :showTotalPageCounter="showTotalPageCounter"
    :pagesRanges="pagesRanges"
    :pageSizes="pagesRanges"
    :total="pagesCount"
    :pageSizeSelectorSuffix="pageRangeSelectorSuffix"
    :pageSizeSelectorGroupLabel="pageRangeSelectorGroupLabel"
    @current-change="handleCurrentChange"
    @on-page-range-changed="handleSizeChange"
    :pageSize="itemsByPage"
  >
  <p>{{`${startIndex} - ${endIndex}`}} {{t('on')}} {{pagesCount}}</p>
  </PPagination>
</template>

<i18n lang="yaml">
    en-US:
        on: 'on'
    fr-FR:
        on: 'sur'
</i18n>

<script setup lang='ts'>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PaginationProps } from './Pagination'
import { PPagination } from '@kpmg/styleguide'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const emit = defineEmits(['page-selected'])
const props = withDefaults(defineProps<PaginationProps>(), {
  pageRangeSelectorSuffix: '',
  pageRangeSelectorGroupLabel: ' '
})

const currentPage = ref(1)
const itemsByPage = ref(props.pagesRanges[0])

const startIndex = computed(() => ((currentPage.value - 1) * itemsByPage.value) + 1)
const endIndex = computed(() => {
  if (((startIndex.value - 1) + itemsByPage.value) >= props.pagesCount) {
    return props.pagesCount
  }
  return startIndex.value - 1 + itemsByPage.value
})

const handleCurrentChange = (e: number) => {
  currentPage.value = e
  updateListDisplay(currentPage.value, itemsByPage.value)
}

const handleSizeChange = (currentItemsByPage: number) => {
  itemsByPage.value = currentItemsByPage
  updateListDisplay(currentPage.value, itemsByPage.value)
}

const updateListDisplay = (currentPage: number, itemsByPage: number) =>
  emit('page-selected', { currentPage, itemsByPage })

</script>

