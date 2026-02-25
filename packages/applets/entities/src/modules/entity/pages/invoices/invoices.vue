<template>
  <div class="margin-top--6">
    <div class="invoices-container">
      <InvoicesInfo />
      <InvoicesForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useInvoicesAccessStore } from '@pulse/common/stores'
import { InvoicesTracking } from '@entities/services/invoices/invoices.tracking.service'
import { InvoicesInfo, InvoicesForm } from './components'

const invoicesAccessStore = useInvoicesAccessStore()

onMounted(() => {
  InvoicesTracking.trackDigitizationValidated(invoicesAccessStore.tabState)
})
</script>

<style scoped lang="scss">
.invoices-container {
  display: flex;
  min-height: 500px;
  width: 100%;
}
</style>
