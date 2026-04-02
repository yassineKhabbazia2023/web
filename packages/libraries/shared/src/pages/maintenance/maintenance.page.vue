<template>
  <PMaintenance
    pIllustrationName="error-page-2"
  >
    <template #title>
      <span>
        {{ t('title.part1') }}
      </span>
      <span class="text-color--secondary-amethyste">
        {{ t('title.part2') }}
      </span>
    </template>

    <template #subtitle>
      {{ t('description') }}
    </template>

    <template #footer>
      <LegalLinks
        :hasCgu="false"
        dark
        class="margin-right--4"
      />
      <ErrorFooterContent />
    </template>
  </PMaintenance>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { PMaintenance } from '@pulse/styleguide/components'
import { onBeforeMount, onBeforeUnmount, onMounted } from 'vue'
import { HTMLService } from '@pulse/common/services/html'
import { initProductFruitsAnonymousCustomer, stopProductFruits } from '@shared/plugins/product-fruits/product-fruits.plugin'

import { LegalLinks, ErrorFooterContent } from '@pulse/shared/components'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      title: {
        part1: 'The platform is under',
        part2: ' maintenance',
      },
      documentTitle: 'Maintenance - RYDGE Conseil',
      description: 'The platform is currently under maintenance. We are working to restore access as soon as possible. Thank you for your patience.\n',
    },
    'fr-FR': {
      title: {
        part1: 'La plateforme est en',
        part2: ' maintenance',
      },
      documentTitle: 'Maintenance - RYDGE Conseil',
      description: 'La plateforme est actuellement en maintenance. Nous faisons le nécessaire pour rétablir l\'accès dans les plus brefs délais. Merci de votre patience.\n',
    },
  },
})

let autoRefresh: ReturnType<typeof setInterval>
const REFRESH_INTERVAL = 1000 * 60 * 15 // 15 minutes

onBeforeMount(async () => {
  initProductFruitsAnonymousCustomer()
})

onMounted(() => {
  HTMLService.setDocumentTitle(t('documentTitle'))
  autoRefresh = setInterval(() => {
    window.location.reload()
  }, REFRESH_INTERVAL)
})

onBeforeUnmount(() => {
  stopProductFruits()
  clearInterval(autoRefresh)
})
</script>

