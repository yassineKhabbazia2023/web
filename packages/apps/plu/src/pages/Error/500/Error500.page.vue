<template>
  <PError
    :pDescription="t('description')"
    :pButtonText="t('textButton')"
    :pErrorName="t('errorName')"
    :pErrorText="t('errorText')"
    pIllustrationName="error-page-2"
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
  title: 'There is an error in our system.'
  description: 'A problem has occured on our end'
  textButton: 'Back to home page'
  errorName: '500'
  errorText: 'Internal server error'
fr-FR:
  title: 'Erreur dans notre système'
  description: 'Un problème est survenu de notre côté, nous travaillons à sa résolution.'
  textButton: "Retour à la page d'accueil"
  errorName: '500'
  errorText: 'Erreur serveur interne'
</i18n>
