<template>
  <div>
    <Header
      class="padding-top--2"
      @refresh-mandate-collection="onUpdateSearchParams"
    />
    <SearchBar
      v-model="searchParams.searchTerm"
      @update:model-value="debouncedRefreshData"
      class="padding-y--6"
    />
    <ListMandate
      :currentPage="searchParams.currentPage"
      :data="mandatesCollection.data"
      @refresh-mandate-collection="onUpdateSearchParams"
    />
    <Pagination
      :currentPage="searchParams.currentPage"
      :pagesCount="mandatesCollection.counters.all"
      :pagesRanges="PAGE_SIZES"
      showTotalPageCounter
      class="padding-x--6"
      @page-selected="onUpdateSearchParams"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMandatesCollection } from '@/services/mandate'
import type { SearchMandateParams } from '@/services/mandate/ServiceMandateTypes'
import Header from '@/components/Common/Header'
import ListMandate from '@/components/DisplayMandate/ListMandate'
import Pagination from '@/components/DisplayMandate/Pagination'
import SearchBar from '@/components/Common/SearchBar'
import { debounce } from '@/helpers/utils'
import type { MandateCollection } from './Models'
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

const searchParams = ref<SearchMandateParams>({
  currentPage: 1,
  limit: PAGE_SIZES[0],
  searchTerm: '',
  sortOrder: 'Descending',
  sortCriteria: '',
  statusCodes: [],
  creationDateStart: '',
  creationDateEnd: '',
  modificationDateStart: '',
  modificationDateEnd: '',
})

async function refreshData() {
  try {
    const { data } = await getMandatesCollection(searchParams.value)
    mandatesCollection.value = data
  } catch (error) {
    console.error(`Error while refresh data ${error}`)
  }
}

async function onUpdateSearchParams(override: Partial<SearchMandateParams>) {
  Object.assign(searchParams.value, override)
  await refreshData()
}

const debouncedRefreshData = debounce(refreshData)

onMounted(() => {
  refreshData()
})
</script>
