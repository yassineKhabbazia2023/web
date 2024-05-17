<template>
  <div>
    <PBreadcrumb
      :pElements="breadcrumbElements"
    />
    <h1 class="h4 margin-top--3 text-color--neutral-gray-700">
      {{ t('title') }}
    </h1>
    <h2 class="margin-top--8 font-small text-color--neutral-gray-500">
      {{ t('active-section-title') }}
    </h2>
    <div class="margin-top--2 flex flex-gap--4 flex--wrap">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import LaunchCard from '@/components/launchCard'
import type { LAUNCHER_KEY, ExtendedLaunchCard } from './HomeTypes'
import {
  getLaunchCards,
  handleClickAction,
  handleDownload,
  getSilaeDownloadLabel,
  getAuthorizedKeys,
} from './HomeUtils'
import { PBreadcrumb } from '@kpmg/styleguide'
import { commonStore as useStore } from '@kpmg/common'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const commonStore = useStore()

const launchCards = ref<ExtendedLaunchCard[]>([])
const isDownloading = ref(false)
const authorizedKeys = ref<LAUNCHER_KEY[]>([])

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

const breadcrumbElements = [{
  pId: -1,
  pText: commonStore.defaultEntity?.legalName ?? '',
}, {
  pId: -1,
  pText: t('title'),
}]

onMounted(() => {
  authorizedKeys.value = getAuthorizedKeys()
  refreshLaunchCards()
})

function refreshLaunchCards(silaeDownloadPercent: number | undefined = undefined) {
  const downloadLabel = getSilaeDownloadLabel(silaeDownloadPercent)
  launchCards.value = getLaunchCards(downloadLabel, authorizedKeys.value)
}
</script>

<i18n lang="yaml">
  en-US:
    title: 'Applications'
    active-section-title: 'Active applications'
  fr-FR:
    title: 'Applications'
    active-section-title: 'Applications activées'
</i18n>
