<template>
  <div>
    <Header />
    <SearchBar v-model="searchText"/>
    <ListMandate :data="mandatesCollection.data" />
    <Pagination
      :pagesCount="mandatesCollection.counters.all"
      :pagesRanges="[10, 20, 30]"
      showTotalPageCounter
      class="padding-left--6 padding-right--6"
      @page-selected="updateTableDisplay"
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
const loading = ref(true)
const itemsToDisplay = ref(10)
const searchText = ref('')
onBeforeMount(async () => {
  try {
    loading.value = true
    const { data } = await getMandatesCollection()
    mandatesCollection.value = data
  } catch (_) {
  } finally {
    loading.value = false
  }
})
const updateTableDisplay = async ({ currentPage, itemsByPage, searchTerm }:
  {currentPage: number, itemsByPage: number, searchTerm: string}) => {
  try {
    loading.value = true
    const skip = (currentPage - 1) * itemsByPage
    itemsToDisplay.value = itemsByPage
    const { data } = await getMandatesCollection({ skip, limit: itemsByPage, searchTerm })
    mandatesCollection.value = data
  } catch (_) {
  } finally {
    loading.value = false
  }
}

watch(searchText,
  (value: string) =>
    updateTableDisplay({ itemsByPage: itemsToDisplay.value, searchTerm: value, currentPage: 1 }))

defineExpose({
  updateTableDisplay
})
</script>

