<template>
  <div>
    <Header
      class="margin-bottom--6"
      @refresh-mandate-collection="onUpdateSearchParams"
    />
    <div class="margin-bottom--3">
      <SearchBar
        v-model="searchParams.searchTerm"
        class="max-width-500"
        @update:model-value="debouncedRefreshData"
      />
    </div>
    <div
      v-if="isLoading"
      class="loader flex flex--justify-content-center flex--align-items-center"
    >
      <PLoader pType="primary" pSize="50" />
    </div>
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
      @page-selected="onUpdateSearchParams"
    />
  </div>
</template>

<script setup lang="ts">
import { logger } from '@pulse/core'
import { ref, onMounted } from 'vue'
import { getMandatesCollection } from '@mandate/services/mandate'
import type { SearchMandateParams } from '@mandate/services/mandate/ServiceMandateTypes'
import Header from '@mandate/components/Common/Header'
import ListMandate from '@mandate/components/DisplayMandate/ListMandate'
import Pagination from '@mandate/components/DisplayMandate/Pagination'
import SearchBar from '@mandate/components/Common/SearchBar'
import { debounce } from '@mandate/helpers/utils'
import type { MandateCollection } from './Models'
import { PAGE_SIZES } from '@mandate/constants'
import { amplitudeService } from '@pulse/common'
import { PLoader } from '@pulse/styleguide/components'

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

const isLoading = ref(false)

async function refreshData() {
  try {
    isLoading.value = true
    const { data } = await getMandatesCollection(searchParams.value)
    mandatesCollection.value = data
  } catch (error) {
    logger.error(`Error while refresh data ${error}`)
  } finally {
    isLoading.value = false
  }
}

function trackMandateSearch(searchContent: string) {
  amplitudeService.track('Bank Mandate Searched', {
    bank_mandate_search: searchContent,
  })
}
async function onUpdateSearchParams(override: Partial<SearchMandateParams>) {
  Object.assign(searchParams.value, override)
  await refreshData()
}

const debouncedRefreshData = debounce(() => {
  refreshData()
  trackMandateSearch(searchParams.value.searchTerm)
})

onMounted(() => {
  refreshData()
})
</script>
