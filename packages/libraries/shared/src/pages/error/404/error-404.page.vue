<template>
  <PError
    :pDescription="t('description')"
    :pButtonText="t('textButton')"
    :pErrorName="t('errorName')"
    :pErrorText="t('errorText')"
    pIllustrationName="error-page-1"
    :pTitle="t('title')"
    @handle-click="redirectToHome"
  >
    <template #footer-middle-content>
      <ErrorFooterContent />
    </template>
  </PError>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import { PError } from '@pulse/styleguide/components'
import { ErrorFooterContent } from '@pulse/shared/components'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const router = useRouter()

const redirectToHome = () => {
  router.push('/')
}
</script>

<i18n lang="yaml">
en-US:
  title: 'This page does not exist.'
  description: "We're sorry, but the page you're looking for cannot be found."
  textButton: 'Back to home page'
  errorName: '404'
  errorText: 'Page not found'
fr-FR:
  title: "Cette page n'existe pas."
  description: 'Nous sommes désolés, mais la page que vous recherchez est introuvable.'
  textButton: "Retour à la page d'accueil"
  errorName: '404'
  errorText: 'Page introuvable'
</i18n>
