<template>
  <HomeLayout>
    <template #header-actions>
      <FeedCenterHeaderWidget v-if="shouldShowFeedCenter" />
    </template>
  </HomeLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { HomeLayout } from '@pulse/shared/layouts'
import { FeedCenterHeaderWidget } from '@pulse/feed-center/widgets/feed-center-header'
import { FeatureFlagManager } from '@pulse/common/managers'

const shouldShowFeedCenter = computed(() => FeatureFlagManager.isFeedCenterActivated())
</script>
