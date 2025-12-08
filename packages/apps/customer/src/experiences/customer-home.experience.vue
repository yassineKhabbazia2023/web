<template>
  <HomeLayout
    :currentEntity
    :favoriteEntities
    :userConfig
    :isVisible
    :currentEntityPermissions
  >
    <template #header-actions>
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
import { FeatureFlagManager } from '@pulse/common/managers'
import { useUserStore, useCurrentEntityStore, usePermissionsStore } from '@pulse/common/stores'

const currentEntityStore = useCurrentEntityStore()
const permissionsStore = usePermissionsStore()
const userStore = useUserStore()

const shouldShowFeedCenter = computed(() => FeatureFlagManager.isFeedCenterActivated())

const { favoriteEntities } = storeToRefs(userStore)
const isSingleEntity = computed(() => userStore.getIsSingleEntity())
const currentEntity = computed(() => currentEntityStore.currentEntity)
const currentEntityPermissions = computed(() => permissionsStore.currentEntityPermissions)

const userConfig = computed((): UserConfig => ({
  isCollab: false,
  isCustomer: true,
  isSingleEntity: isSingleEntity.value ?? false,
}))

const isVisible = computed(() => {
  const user = userStore.user
  const currentEntity = currentEntityStore.currentEntity

  return user !== undefined && currentEntity !== undefined
})
</script>
