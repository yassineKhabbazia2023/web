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
import { useUserStore, useCurrentEntityStore } from '@pulse/common/stores'
import { Feature } from '@pulse/common/enums'

const currentEntityStore = useCurrentEntityStore()
const userStore = useUserStore()

const shouldShowFeedCenter = FeatureFlagManager.isFeedCenterActivated() === true
const shouldShowBooking = FeatureFlagManager.isFeatureActivated(Feature.BOOKING) === true

const { favoriteEntities } = storeToRefs(userStore)
const currentEntity = computed(() => currentEntityStore.currentEntity)

const userConfig = computed((): UserConfig => ({
  isCollab: true,
  isCustomer: false,
  isSingleEntity: false,
}))
</script>
