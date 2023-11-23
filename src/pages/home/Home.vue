<template>
  <div>
    <Header />
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
import { ref, onBeforeMount } from 'vue'
import { getMandatesCollection } from '@/services/mandate'
import Header from '@/components/Common/Header'
import ListMandate from '@/components/DisplayMandate/Table'
import Pagination from '@/components/DisplayMandate/Pagination'
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
onBeforeMount(async () => {
  try {
    loading.value = true
    const { data } = await getMandatesCollection()
    mandatesCollection.value = data
  } catch (error) {
  } finally {
    loading.value = false
  }
})
const updateTableDisplay = async ({ currentPage, itemsByPage }:
  {currentPage: number, itemsByPage: number}) => {
  try {
    loading.value = true
    const skip = (currentPage - 1) * itemsByPage
    const limit = itemsByPage
    const { data } = await getMandatesCollection({ skip, limit })
    mandatesCollection.value = data
  } finally {
    loading.value = false
  }
}

defineExpose({
  updateTableDisplay
})
</script>

