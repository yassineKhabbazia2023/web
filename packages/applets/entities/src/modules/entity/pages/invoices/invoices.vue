<template>
  <div class="margin-top--6">
    <div class="invoices-container">
      <InvoicesInfo />
      <InvoicesForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import { InvoicesInfo, InvoicesForm } from './components'
</script>

<style scoped lang="scss">
.invoices-container {
  display: flex;
  min-height: 500px;
  width: 100%;
}
</style>
