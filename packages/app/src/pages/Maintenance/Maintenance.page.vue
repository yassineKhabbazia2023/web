<template>
  <PError
    :pDescription="t('description')"
    pErrorName=""
    pErrorText=""
    :pHasFooter="false"
    pIllustrationName="error-page-2"
    :pTitle="t('title')"
  />
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { PError } from '@pulse/styleguide/components'
import { onBeforeUnmount, onMounted } from 'vue'
import { HTMLService } from '@pulse/core'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})
let autoRefresh: ReturnType<typeof setInterval>
const REFRESH_INTERVAL = 1000 * 60 * 15 // 15 minutes

onMounted(() => {
  HTMLService.setDocumentTitle(t('documentTitle'))
  autoRefresh = setInterval(() => {
    window.location.reload()
  }, REFRESH_INTERVAL)
})

onBeforeUnmount(() => {
  clearInterval(autoRefresh)
})
</script>

<i18n lang="yaml">
en-US:
  title: 'The platform is under maintenance'
  documentTitle: 'Maintenance - RYDGE Conseil'
  description: >
    The platform is currently under maintenance.
    We are working to restore access as soon as possible.
    Thank you for your patience.
fr-FR:
  title: 'La plateforme est en maintenance'
  documentTitle: 'Maintenance - RYDGE Conseil'
  description: >
    La plateforme est actuellement en maintenance.
    Nous faisons le nécessaire pour rétablir l’accès dans les plus brefs délais.
    Merci de votre patience.
</i18n>
