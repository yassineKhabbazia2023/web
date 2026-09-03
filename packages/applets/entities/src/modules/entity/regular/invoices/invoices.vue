<template>
  <div class="margin-top--2">
    <AccessVaultRedirect
      v-if="shouldShowAccessVaultRedirect"
      class="max-width-800"
    />

    <div
      v-else
      class="invoices-container"
    >
      <InvoicesForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useInvoicesAccessStore } from '@pulse/common/stores'
import { InvoicesTracking } from './services/invoices.tracking.service'
import { InvoicesForm } from './components'
import AccessVaultRedirect from './components/access-vault-redirect/access-vault-redirect.vue'
import { useInvoicesPage } from './invoices.composable'

const invoicesAccessStore = useInvoicesAccessStore()

const { shouldShowAccessVaultRedirect } = useInvoicesPage()

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
