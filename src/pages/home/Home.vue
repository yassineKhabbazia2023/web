<template>
  <div>
    <Header />
    <ListMandate v-if="!loading" :data="mandatesCollection.data" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { getMandatesCollection } from '@/services/mandate'
import Header from '@/components/Common/Header'
import ListMandate from '@/components/DisplayMandate/Table'
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
</script>

