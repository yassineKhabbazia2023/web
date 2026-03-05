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
import { storeToRefs } from 'pinia'

import { useCurrentEntityStore } from '@pulse/common/stores'
import { PEntityHeader } from '@pulse/styleguide/components'
import { useResponsive } from '@pulse/styleguide'

import TopBar from './TopBar/top-bar.vue'
import WidgetsHome from './WidgetsHome.vue'

const { isMobile } = useResponsive()
const currentEntityStore = useCurrentEntityStore()
const { currentEntity } = storeToRefs(currentEntityStore)
</script>
