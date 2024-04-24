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
      @click-download="onClickDownload(launchCard.key)"
      @click-action="onClickAction(launchCard.key)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LaunchCard from '@/components/launchCard'
import type { LAUNCHER_KEY, ExtendedLaunchCard } from './HomeTypes'
import { getLaunchCards, handleClickAction, handleDownload, getSilaeDownloadLabel } from './HomeUtils'

const launchCards = ref<ExtendedLaunchCard[]>([])
const isDownloading = ref(false)

function onSilaeDownloadProgress(silaeDownloadPercent: number) {
  refreshLaunchCards(silaeDownloadPercent)
}

async function onClickDownload(key: LAUNCHER_KEY) {
  if (isDownloading.value) {
    return
  }
  onSilaeDownloadProgress(0)
  isDownloading.value = true
  await handleDownload(key, onSilaeDownloadProgress)
  isDownloading.value = false
}

async function onClickAction(key: LAUNCHER_KEY) {
  await handleClickAction(key)
}

onMounted(() => {
  refreshLaunchCards()
})

function refreshLaunchCards(silaeDownloadPercent: number | undefined = undefined) {
  const downloadLabel = getSilaeDownloadLabel(silaeDownloadPercent)
  launchCards.value = getLaunchCards(downloadLabel)
}
</script>
