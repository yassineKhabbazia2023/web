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
      <!-- A widget that is registered  from GED -->
      <component
        :is="WidgetName.EMAIL_PENNYLANE"
        v-if="FeatureFlagManager.isMailToPennylaneActivated() === true"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { TopBarManager } from './top-bar.manager'
import { PennylaneSSOCustomer, PennylaneSSOCollab } from '@pulse/widgets/gridless'
import { WidgetName } from '@pulse/widgets/enums'
import { FeatureFlagManager } from '@pulse/core'

const isPennylaneSSODisplayed = ref(false)

onMounted(() => {
  isPennylaneSSODisplayed.value = TopBarManager.isPennylaneSSODisplayed()
})
</script>
