<template>
  <HomeLayout
    :currentEntity
    :favoriteEntities
    :userConfig
  >
    <template #header-actions>
      <BookingHeaderWidget v-if="shouldShowBooking === true" />
      <FeedCenterHeaderWidget v-if="shouldShowFeedCenter === true" />
    </template>
  </HomeLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { HomeLayout } from '@pulse/shared/layouts'
import type { UserConfig } from '@pulse/shared/types'
import { FeedCenterHeaderWidget } from '@pulse/feed-center/widgets/feed-center-header'
import { BookingHeaderWidget } from '@pulse/booking/collab/widgets/header-widget'
import { FeatureFlagManager } from '@pulse/common/managers'
import { useUserStore, useCurrentEntityStore, useBookingCollabStore } from '@pulse/common/stores'

const currentEntityStore = useCurrentEntityStore()
const userStore = useUserStore()
const bookingStore = useBookingCollabStore()

const shouldShowFeedCenter = FeatureFlagManager.isFeedCenterActivated() === true
const shouldShowBooking = computed(() => bookingStore.getIsBookingEnabled() === true)

const { favoriteEntities } = storeToRefs(userStore)
const currentEntity = computed(() => currentEntityStore.currentEntity)

const userConfig = computed((): UserConfig => ({
  isCollab: true,
  isCustomer: false,
  isSingleEntity: false,
}))
</script>
