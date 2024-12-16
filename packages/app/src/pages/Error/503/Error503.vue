<template>
  <PError
    :pDescription="t('description')"
    :pButtonText="t('textButton')"
    :pErrorName="t('errorName')"
    :pErrorText="t('errorText')"
    pIllustrationName="error-page-2"
    :pTitle="(t('title'))"
    @handle-click="redirectToHome"
  >
    <template #footer-middle-content>
      <ErrorFooterContent />
    </template>
  </PError>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { PError } from '@pulse/styleguide/components'
import { useRedirection } from '@app/composables/useRedirection'
import ErrorFooterContent from '@app/pages/Error/components/ErrorFooterContent'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const { redirectToHome } = useRedirection()
</script>

<i18n lang="yaml">
en-US:
  title: 'Service is unavailable'
  description: 'This may be due to server overload or temporary maintenance. Please try again later.'
  textButton: 'Back to home page'
  errorName: '503'
  errorText: 'Service unavailable'
fr-FR:
  title: 'Il semble que nous ayons un problème'
  description: 'Cela peut être dû à une surcharge du serveur ou à une maintenance temporaire, veuillez réessayer ultérieurement.'
  textButton: "Retour à la page d'accueil"
  errorName: '503'
  errorText: 'Service indisponible'
</i18n>
