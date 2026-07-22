<template>
  <div class="collaborator-home-experience">
    <MobileHomeLayout
      v-if="shouldShowMobileLayout === true"
      :currentEntity
    >
      <template #header-actions>
        <BookingCollabHeaderWidget v-if="shouldShowBooking === true" />
        <FeedCenterHeaderWidget />
      </template>
    </MobileHomeLayout>
    <HomeLayout
      v-else
      :currentEntity
      :favoriteEntities
      :userConfig
    >
      <template #header-actions>
        <BookingCollabHeaderWidget v-if="shouldShowBooking === true" />
        <FeedCenterHeaderWidget />
      </template>
    </HomeLayout>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import type { UserConfig } from '@pulse/shared/types'
import { FeedCenterHeaderWidget } from '@pulse/feed-center/widgets/feed-center-header'
import { BookingCollabHeaderWidget } from '@pulse/booking/widgets'
import { FeatureFlagManager } from '@pulse/common/managers'
import { useUserStore, useCurrentEntityStore, useBookingCollabStore } from '@pulse/common/stores'
import { useResponsive } from '@pulse/styleguide'

const MobileHomeLayout = defineAsyncComponent(() =>
  import('@pulse/shared/layouts').then(m => m.MobileHomeLayout),
)
const HomeLayout = defineAsyncComponent(() =>
  import('@pulse/shared/layouts').then(m => m.HomeLayout),
)

const currentEntityStore = useCurrentEntityStore()
const userStore = useUserStore()
const bookingStore = useBookingCollabStore()

const { isMobile } = useResponsive()

const shouldShowMobileLayout = computed(() =>
  FeatureFlagManager.isResponsiveActivated() && isMobile.value === true,
)
const shouldShowBooking = computed(() => bookingStore.isBookingEnabled === true)

const { favoriteEntities } = storeToRefs(userStore)
const currentEntity = computed(() => currentEntityStore.currentEntity)

const userConfig = computed((): UserConfig => ({
  isCollab: true,
  isCustomer: false,
  isSingleEntity: false,
}))
</script>
