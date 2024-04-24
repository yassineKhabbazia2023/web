<template>
  <div class="flex flex-gap--4 flex--wrap">
    <LaunchCard
      v-for="(launchCard, index) in launchCards"
      class="flex--basis-30 flex--grow-1"
      :data-testid="`launch-card-${launchCard.key}`"
      :key="index"
      :title="launchCard.title"
      :subtitle="launchCard.subtitle"
      :imageType="launchCard.imageType"
      :imageName="launchCard.imageName"
      :actionLabel="launchCard.actionLabel"
      :actionUrl="launchCard.actionUrl"
      :downloadLabel="launchCard.downloadLabel"
      @click-action="onClickAction(launchCard.key)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LaunchCard from '@/components/launchCard'
import type { LAUNCHER_KEY, ExtendedLaunchCard } from './HomeTypes'
import { getLaunchCards, handleClickAction } from './HomeUtils'

const launchCards = ref<ExtendedLaunchCard[]>([])

async function onClickAction(key: LAUNCHER_KEY) {
  await handleClickAction(key)
}

onMounted(() => {
  launchCards.value = getLaunchCards()
})
</script>
