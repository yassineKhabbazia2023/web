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
      v-show="isLoading === false"
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
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { logger, useDebounce } from '@pulse/toolbox'
import { getMandatesCollection } from '@mandate/services/mandate'
import type { SearchMandateParams } from '@mandate/services/mandate/ServiceMandateTypes'
import type { MandateCollection } from '@mandate/types/mandate.types'
import { PAGE_SIZES } from '@pulse/common/constants'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { PLoader } from '@pulse/styleguide/components'
import { RouteName } from '@pulse/common/enums'

import Header from '@mandate/components/Common/Header'
import ListMandate from '@mandate/components/DisplayMandate/ListMandate'
import Pagination from '@mandate/components/DisplayMandate/Pagination'
import SearchBar from '@mandate/components/Common/SearchBar'

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
const route = useRoute()
watch(route, (value) => {
  if (value.name === RouteName.MANDATES) {
    // Backend will always return a simple string in this case
    searchParams.value.searchTerm = value.query.bankAccountNumber as string
  }
}, {
  immediate: true,
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
  AmplitudeService.track('Bank Mandate Searched', {
    bank_mandate_search: searchContent,
  })
}
async function onUpdateSearchParams(override: Partial<SearchMandateParams>) {
  Object.assign(searchParams.value, override)
  await refreshData()
}

const debouncedRefreshData = useDebounce(() => {
  refreshData()
  trackMandateSearch(searchParams.value.searchTerm)
}, 500)

onMounted(() => {
  refreshData()
})
</script>
