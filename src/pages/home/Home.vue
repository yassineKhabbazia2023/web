<template>
  <div>
    <Header />
    <SearchBar
      v-model="searchText"
      class="padding-left--6 padding-right--6 padding-bottom--6"
    />
    <ListMandate
      :data="mandatesCollection.data"
      @sort-column-change="updateTableDisplay"
    />
    <Pagination
      :pagesCount="mandatesCollection.counters.all"
      :pagesRanges="[10, 20, 30]"
      showTotalPageCounter
      class="padding-left--6 padding-right--6"
      @page-selected="updateTableDisplay"
      :currentPage="activePage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch } from 'vue'
import { getMandatesCollection } from '@/services/mandate'
import Header from '@/components/Common/Header'
import ListMandate from '@/components/DisplayMandate/Table'
import Pagination from '@/components/DisplayMandate/Pagination'
import SearchBar from '@/components/Common/SearchBar'
import { debounce } from '@/helpers/utils'
import type { MandateCollection } from './Models'

const mandatesCollection = ref<MandateCollection>({
  counters: {
    all: 0,
    status10: 0,
    status20: 0,
    status30: 0,
    status40: 0,
    status50: 0
  },
  data: []
})

const defaultItemsToDisplay = ref(10)
const activePage = ref(1)
const searchText = ref('')
const defaultSortOrder = ref('Descending')
const defaultSortCriteria = ref('')

onBeforeMount(async () => {
  try {
    const { data } = await getMandatesCollection()
    mandatesCollection.value = data
  } catch (_) {
  }
})

const updateTableDisplay = async ({
  currentPage = 1,
  itemsByPage = defaultItemsToDisplay.value,
  searchTerm = searchText.value,
  sortOrder = defaultSortOrder.value,
  sortCriteria = defaultSortCriteria.value
}:
  {
    currentPage: number, itemsByPage: number,
    searchTerm: string, sortOrder: string,
    sortCriteria: string
  }) => {
  try {
    if (currentPage !== activePage.value) {
      activePage.value = currentPage
    }
    const skip = (currentPage - 1) * itemsByPage
    defaultItemsToDisplay.value = itemsByPage
    defaultSortOrder.value = sortOrder
    defaultSortCriteria.value = sortCriteria
    const { data } = await getMandatesCollection({
      skip,
      limit: itemsByPage,
      searchTerm: searchTerm.trim(),
      sortOrder,
      sortCriteria
    })
    mandatesCollection.value = data
  } catch (_) {
  }
}

const updateTableDisplayDebounced = debounce(updateTableDisplay)

watch(searchText,
  (value: string) =>
    updateTableDisplayDebounced({
      searchTerm: value
    })
)

defineExpose({
  updateTableDisplay
})
</script>

