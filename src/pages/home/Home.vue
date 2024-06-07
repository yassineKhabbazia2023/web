<template>
  <div>
    <Header
      class="padding-top--2"
      @refresh-mandate-collection="onRefresh"
    />
    <SearchBar
      v-model="searchText"
      class="padding-y--6"
    />
    <ListMandate
      :currentPage="activePage"
      :data="mandatesCollection.data"
      @refresh-mandate-collection="updateTableDisplay"
    />
    <Pagination
      :pagesCount="mandatesCollection.counters.all"
      :pagesRanges="PAGE_SIZES"
      showTotalPageCounter
      class="padding-x--6"
      @page-selected="onRefresh"
      :currentPage="activePage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getMandatesCollection } from '@/services/mandate'
import Header from '@/components/Common/Header'
import ListMandate from '@/components/DisplayMandate/ListMandate'
import Pagination from '@/components/DisplayMandate/Pagination'
import SearchBar from '@/components/Common/SearchBar'
import { debounce } from '@/helpers/utils'
import type { MandateCollection } from './Models'
import type { UpdateTableDisplayParams } from './HomeTypes'
import { PAGE_SIZES } from '@/constants'

const mandatesCollection = ref<MandateCollection>({
  counters: {
    all: 0,
    status10: 0,
    status20: 0,
    status30: 0,
    status40: 0,
    status50: 0,
  },
  data: [],
})

const defaultItemsToDisplay = ref(10)
const activePage = ref(1)
const searchText = ref('')
const defaultSortOrder = ref('Descending')
const defaultSortCriteria = ref('')
const currentStatusCodes = ref<number[]>([])

onMounted(async () => {
  try {
    const { data } = await getMandatesCollection({})
    mandatesCollection.value = data
  } catch (error) {
    console.error(`Error in mandate mount ${error}`)
  }
})

const updateTableDisplay = async ({
  currentPage = 1,
  itemsByPage = defaultItemsToDisplay.value,
  searchTerm = searchText.value,
  sortOrder = defaultSortOrder.value,
  sortCriteria = defaultSortCriteria.value,
  statusCodes = [],
}: Partial<UpdateTableDisplayParams>) => {
  currentStatusCodes.value = statusCodes
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
      sortCriteria,
      statusCodes,
    })
    mandatesCollection.value = data
  } catch (error) {
    console.error(error)
  }
}

async function onRefresh(override: Partial<UpdateTableDisplayParams>) {
  const params = {
    currentPage: activePage.value,
    itemsByPage: defaultItemsToDisplay.value,
    searchTerm: searchText.value,
    sortOrder: defaultSortOrder.value,
    sortCriteria: defaultSortCriteria.value,
    statusCodes: currentStatusCodes.value,
    ...override,
  }
  await updateTableDisplay(params)
}

const updateTableDisplayDebounced = debounce(updateTableDisplay)

watch(searchText,
  (value: string) =>
    updateTableDisplayDebounced({
      searchTerm: value,
    }),
)
</script>
