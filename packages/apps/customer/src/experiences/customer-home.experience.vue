<template>
  <div class="customer-home-experience">
    <MobileHomeLayout
      v-if="shouldShowMobileLayout === true"
      :currentEntity
    >
      <template #header-actions>
        <BookingCustomerHeaderWidget v-if="shouldShowBooking === true" />
        <FeedCenterHeaderWidget v-if="shouldShowFeedCenter === true" />
      </template>
    </MobileHomeLayout>
    <HomeLayout
      v-else
      :currentEntity
      :favoriteEntities
      :userConfig
    >
      <template #header-actions>
        <BookingCustomerHeaderWidget v-if="shouldShowBooking === true" />
        <FeedCenterHeaderWidget v-if="shouldShowFeedCenter === true" />
      </template>
    </HomeLayout>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import type { UserConfig } from '@pulse/shared/types'
import { FeedCenterHeaderWidget } from '@pulse/feed-center/widgets/feed-center-header'
import { BookingCustomerHeaderWidget } from '@pulse/booking/widgets'
import { FeatureFlagManager } from '@pulse/common/managers'
import { useUserStore, useCurrentEntityStore } from '@pulse/common/stores'
import { useBookingCustomerStore } from '@pulse/booking/stores'
import { useResponsive } from '@pulse/styleguide'

const MobileHomeLayout = defineAsyncComponent(() =>
  import('@pulse/shared/layouts').then(m => m.MobileHomeLayout),
)
const HomeLayout = defineAsyncComponent(() =>
  import('@pulse/shared/layouts').then(m => m.HomeLayout),
)

const currentEntityStore = useCurrentEntityStore()
const userStore = useUserStore()
const bookingStore = useBookingCustomerStore()

const { isMobile } = useResponsive()

const shouldShowMobileLayout = computed(() =>
  FeatureFlagManager.isResponsiveActivated() && isMobile.value === true,
)
const shouldShowFeedCenter = computed(() => FeatureFlagManager.isFeedCenterActivated())
const shouldShowBooking = computed(() => bookingStore.getIsBookingEnabled() === true)

const { favoriteEntities } = storeToRefs(userStore)
const isSingleEntity = computed(() => userStore.getIsSingleEntity())
const currentEntity = computed(() => currentEntityStore.currentEntity)

const userConfig = computed((): UserConfig => ({
  isCollab: false,
  isCustomer: true,
  isSingleEntity: isSingleEntity.value ?? false,
}))
</script>
