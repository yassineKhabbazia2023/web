<template>
  <div class="customer-home-experience">
    <MobileHomeLayout
      v-if="shouldShowMobileLayout === true"
      :currentEntity
    />
    <HomeLayout
      v-else
      :currentEntity
      :favoriteEntities
      :userConfig
    >
      <template #header-actions>
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
import { FeatureFlagManager } from '@pulse/common/managers'
import { useUserStore, useCurrentEntityStore } from '@pulse/common/stores'
import { useBreakpoint } from '@pulse/styleguide'

const MobileHomeLayout = defineAsyncComponent(() =>
  import('@pulse/shared/layouts').then(m => m.MobileHomeLayout),
)
const HomeLayout = defineAsyncComponent(() =>
  import('@pulse/shared/layouts').then(m => m.HomeLayout),
)

const currentEntityStore = useCurrentEntityStore()
const userStore = useUserStore()

const { isMobile } = useBreakpoint()

const shouldShowMobileLayout = computed(() =>
  FeatureFlagManager.isResponsiveActivated() && isMobile.value === true,
)
const shouldShowFeedCenter = computed(() => FeatureFlagManager.isFeedCenterActivated())

const { favoriteEntities } = storeToRefs(userStore)
const isSingleEntity = computed(() => userStore.getIsSingleEntity())
const currentEntity = computed(() => currentEntityStore.currentEntity)

const userConfig = computed((): UserConfig => ({
  isCollab: false,
  isCustomer: true,
  isSingleEntity: isSingleEntity.value ?? false,
}))
</script>
