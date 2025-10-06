<template>
  <div class="wallet-landing-page" data-testid="wallet-landing-page">
    <BookingRendezVousDrawer
      v-model:isOpened="isOpenedBookingRendezVousDrawer"
    />
    <PEntityHeader
      v-if="selectedEntity"
      :pLegalName="selectedEntity.legalName"
      :pAccountNumber="selectedEntity.accountNumber"
      class="margin-bottom--4"
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
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useSelectedEntityStore, useBookingStore } from '@pulse/common/stores'
import { FeatureFlagManager } from '@pulse/core'

import { PEntityHeader } from '@pulse/styleguide/components'
import BookingRendezVousDrawer from '@entities/common/components/booking-rendez-vous-drawer/booking-rendez-vous-drawer.vue'

import TopBar from './TopBar/top-bar.vue'
import WidgetsHome from './WidgetsHome.vue'
import LegacyHome from './LegacyHome.vue'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { AmplitudeEvent, AmplitudeFeatureName } from '@pulse/common/enums'

const selectedEntityStore = useSelectedEntityStore()
const { selectedEntity } = storeToRefs(selectedEntityStore)

const bookingStore = useBookingStore()

const isOpenedBookingRendezVousDrawer = computed({
  get: () => bookingStore.isOpenedBookingRendezVousDrawer,
  set: (isOpened: boolean) => bookingStore.isOpenedBookingRendezVousDrawer = isOpened,
})

onMounted(() => {
  AmplitudeService.track(AmplitudeEvent.FEATURE_CONSULTED, {
    feature_name: AmplitudeFeatureName.HOMEPAGE,
  })
})
</script>
