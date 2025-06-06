<template>
  <div class="wallet-landing-page" data-testid="wallet-landing-page">
    <EntityHeader
      v-if="selectedEntity"
      :legalName="selectedEntity.legalName"
      :accountNumber="selectedEntity.accountNumber"
    />
    <div v-if="FeatureFlagManager.isHomepageWidgetsActivated() === true">
      <TopBar />
      <WidgetsHome />
    </div>
    <div v-else-if="FeatureFlagManager.isHomepageWidgetsActivated() === false">
      <LegacyHome />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useSelectedEntityStore } from '@pulse/common/stores'
import { FeatureFlagManager } from '@pulse/core'

import EntityHeader from '@entities/common/components/EntityHeader'
import TopBar from './TopBar/top-bar.vue'
import WidgetsHome from './WidgetsHome.vue'
import LegacyHome from './LegacyHome.vue'

const selectedEntityStore = useSelectedEntityStore()
const { selectedEntity } = storeToRefs(selectedEntityStore)
</script>
