<template>
  <div
    :key="currentEntity?.accountId"
    class="home-page"
    data-testid="home-page"
  >
    <PEntityHeader
      v-if="currentEntity && isMobile === false"
      :pLegalName="currentEntity.legalName"
      :pAccountNumber="currentEntity.accountNumber"
      class="margin-bottom--4"
    />
    <TopBar />
    <WidgetsHome />
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useCurrentEntityStore, useDematMailStore } from '@pulse/common/stores'
import { DematMailLocalisation } from '@pulse/common/services/invoices'
import { PEntityHeader } from '@pulse/styleguide/components'
import { useResponsive } from '@pulse/styleguide'

import TopBar from './TopBar/top-bar.vue'
import WidgetsHome from './WidgetsHome.vue'

const { isMobile } = useResponsive()
const currentEntityStore = useCurrentEntityStore()
const { currentEntity } = storeToRefs(currentEntityStore)

// The demat mail dialog is solicited on the folder homepage. The eligibility is
// resolved asynchronously, hence the watch rather than a plain onMounted check.
const dematMailStore = useDematMailStore()
const { shouldAutoOpenDialog } = storeToRefs(dematMailStore)

watch(shouldAutoOpenDialog, (shouldOpen) => {
  if (shouldOpen) {
    dematMailStore.openDialog(DematMailLocalisation.CONNECTION)
  }
}, { immediate: true })
</script>
