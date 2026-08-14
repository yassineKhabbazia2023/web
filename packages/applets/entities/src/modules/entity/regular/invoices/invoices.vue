<template>
  <div class="margin-top--2">
    <div class="invoices-container">
      <InvoicesForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useInvoicesAccessStore } from '@pulse/common/stores'
import { InvoicesTracking } from './services/invoices.tracking.service'
import { InvoicesForm } from './components'

const invoicesAccessStore = useInvoicesAccessStore()

onMounted(() => {
  InvoicesTracking.trackDigitizationValidated(invoicesAccessStore.tabState)
})
</script>

<style scoped lang="scss">
.invoices-container {
  display: flex;
  justify-content: center;
  min-height: 500px;
  width: 100%;
}
</style>
