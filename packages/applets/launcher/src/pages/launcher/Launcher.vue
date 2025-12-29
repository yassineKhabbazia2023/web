<template>
  <div>
    <template v-if="isClient">
      <PEntityHeader
        v-if="currentEntity"
        :pLegalName="currentEntity.legalName"
        :pAccountNumber="currentEntity.accountNumber"
        class="margin-bottom--4"
      />
      <h1
        class="h4 margin-top--3 text-color--neutral-gray-700"
        data-testid="launcher-home-title"
      >
        {{ t('title') }}
      </h1>
      <h2
        class="margin-top--8 font-small text-color--neutral-gray-500"
        data-testid="launcher-home-section-title"
      >
        {{ t('active-section-title') }}
      </h2>
    </template>
    <PAlert
      v-if="currentEntityPermissions && launchCards.length === 0"
      pType="danger"
      class="margin-top--3"
      data-testid="home-no-launcher"
    >
      {{ t('no-launcher') }}
    </PAlert>
    <div v-else class="margin-top--2 flex flex-gap--4 flex--wrap">
      <LaunchCard
        v-for="launchCard in launchCards"
        :key="launchCard.key"
        class="flex--basis-30 flex--grow-1"
        :data-testid="`launch-card-${launchCard.key}`"
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
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { CurrentUserManager } from '@pulse/common/managers'
import { RouteName } from '@pulse/common/enums'
import { usePennylaneSso } from '@pulse/common/composables/pennylane-sso'
import { PAlert, PEntityHeader } from '@pulse/styleguide/components'
import LaunchCard from '@launcher/components/launchCard'
import { LAUNCHER_AUTHORIZATIONS } from '@launcher/common/authorizationConst'
import type { ExtendedLaunchCard } from './LauncherTypes'
import { LauncherKey } from './LauncherTypes'
import { useCurrentEntityStore, usePermissionsStore, useUserStore } from '@pulse/common/stores'
import {
  getLaunchCards,
  handleClickAction,
  handleDownload,
  getSilaeDownloadLabel,
} from './LauncherUtils'

const route = useRoute()
const userStore = useUserStore()
const { url: pennylaneSsoUrl, clearSsoContext: clearPennylaneSsoContext } = usePennylaneSso({ isCollab: userStore.isCollab })

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const isDownloading = ref(false)
const silaeDownloadPercent = ref<number | undefined>()

function onSilaeDownloadProgress(downloadPercent: number) {
  silaeDownloadPercent.value = downloadPercent
}

async function onClickDownload(key: LauncherKey) {
  if (isDownloading.value) {
    return
  }
  onSilaeDownloadProgress(0)
  isDownloading.value = true
  await handleDownload(key, onSilaeDownloadProgress)
  isDownloading.value = false
}

async function onClickAction(key: LauncherKey) {
  if (key === LauncherKey.PENNYLANE) {
    clearPennylaneSsoContext()
  }
  await handleClickAction(key)
}

const isClient = computed(() => route.name === RouteName.LAUNCHER)
const currentEntityStore = useCurrentEntityStore()
const permissionsStore = usePermissionsStore()

const { currentEntity } = storeToRefs(currentEntityStore)
const { currentEntityPermissions } = storeToRefs(permissionsStore)

const authorizedKeys = computed<LauncherKey[]>(() =>
  LAUNCHER_AUTHORIZATIONS
    .filter(({ authorizationCodes }) => CurrentUserManager.hasPermission(authorizationCodes)).map<LauncherKey>(
      ({ key }) => key,
    ),
)

const launchCards = computed<ExtendedLaunchCard[]>(() => {
  const downloadLabel = getSilaeDownloadLabel(silaeDownloadPercent.value)
  const cards = getLaunchCards(downloadLabel, authorizedKeys.value, userStore.isCollab)

  return cards.map(card => {
    if (card.key === LauncherKey.PENNYLANE) {
      return { ...card, actionUrl: pennylaneSsoUrl.value }
    }
    return card
  })
})

</script>

<i18n lang="yaml">
en-US:
  title: 'Applications'
  active-section-title: 'Active applications'
  no-launcher: 'You do not have the necessary permissions to access these applications.'
fr-FR:
  title: 'Applications'
  active-section-title: 'Applications activées'
  no-launcher: "Vous n'avez pas les permissions nécessaires pour accéder à ces applications."
</i18n>
