<template>
  <div
    class="
      home-top-bar
      flex
      flex-gap--4
    "
  >
    <template v-if="isPennylaneSSODisplayed === true">
      <PennylaneSSOCustomer v-if="TopBarManager.shouldDisplayCustomerSSO() === true" />
      <PennylaneSSOCollab v-if="TopBarManager.shouldDisplayCustomerSSO() === false" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { TopBarManager } from './top-bar.manager'
import { PennylaneSSOCustomer, PennylaneSSOCollab } from '@pulse/widgets/gridless'

const isPennylaneSSODisplayed = ref(false)

onMounted(() => {
  isPennylaneSSODisplayed.value = TopBarManager.isPennylaneSSODisplayed()
})

</script>
