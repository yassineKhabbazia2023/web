<template>
  <HomeLayout>
    <template #header-actions>
      <BookingHeaderWidget v-if="shouldShowBooking" />
      <FeedCenterHeaderWidget v-if="shouldShowFeedCenter" />
    </template>
  </HomeLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { HomeLayout } from '@pulse/shared/layouts'
import { FeedCenterHeaderWidget } from '@pulse/feed-center/widgets/feed-center-header'
import { BookingHeaderWidget } from '@pulse/booking/widgets/booking-header'
import { BookingManager } from '@pulse/booking/managers/booking'
import { FeatureFlagManager } from '@pulse/common/managers'
import { Feature } from '@pulse/common/enums'
import { useUserStore } from '@pulse/common/stores'

const userStore = useUserStore()

const shouldShowFeedCenter = computed(() => FeatureFlagManager.isFeedCenterActivated())
const shouldShowBooking = computed(() =>
  userStore.isCollab === true &&
  FeatureFlagManager.isFeatureActivated(Feature.BOOKING) === true,
)

onMounted(async () => {
  await BookingManager.refreshAvailableExperts()
})
</script>
