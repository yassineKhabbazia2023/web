<template>
  <HomeLayout
    :currentEntity
    :favoriteEntities
    :userConfig
    :isVisible
    :currentEntityPermissions
  >
    <template #header-actions>
      <BookingHeaderWidget v-if="shouldShowBooking === true" />
      <FeedCenterHeaderWidget v-if="shouldShowFeedCenter === true" />
    </template>
  </HomeLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { HomeLayout } from '@pulse/shared/layouts'
import type { UserConfig } from '@pulse/shared/types'
import { FeedCenterHeaderWidget } from '@pulse/feed-center/widgets/feed-center-header'
import { BookingHeaderWidget } from '@pulse/booking/widgets/booking-header'
import { BookingManager } from '@pulse/booking/managers/booking'
import { FeatureFlagManager } from '@pulse/common/managers'
import { useUserStore, useCurrentEntityStore, usePermissionsStore } from '@pulse/common/stores'
import { Feature } from '@pulse/common/enums'

const currentEntityStore = useCurrentEntityStore()
const permissionsStore = usePermissionsStore()
const userStore = useUserStore()

const shouldShowFeedCenter = computed(() => FeatureFlagManager.isFeedCenterActivated())

const { favoriteEntities } = storeToRefs(userStore)
const { isCollab, isCustomer } = storeToRefs(userStore)
const isSingleEntity = computed(() => userStore.getIsSingleEntity())
const currentEntity = computed(() => currentEntityStore.currentEntity)
const currentEntityPermissions = computed(() => permissionsStore.currentEntityPermissions)

const userConfig = computed((): UserConfig => ({
  isCollab: isCollab.value ?? false,
  isCustomer: isCustomer.value ?? false,
  isSingleEntity: isSingleEntity.value ?? false,
}))

const isVisible = computed(() => {
  const user = userStore.user
  const currentEntity = currentEntityStore.currentEntity

  return user !== undefined && currentEntity !== undefined
})

const shouldShowBooking = computed(() =>
  userStore.isCollab === true &&
  FeatureFlagManager.isFeatureActivated(Feature.BOOKING) === true,
)

onMounted(async () => {
  await BookingManager.refreshAvailableExperts()
})
</script>
