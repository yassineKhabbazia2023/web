<template>
  <PError
    :pDescription="t('description')"
    :pButtonText="t('textButton')"
    :pErrorName="t('errorName')"
    :pErrorText="t('errorText')"
    pIllustrationName="error-generic"
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
  title: 'There is an error in your system.'
  description: 'A problem seems to have occurred on your machine.'
  textButton: 'Back to home page'
  errorName: '400'
  errorText: 'Bad request'
fr-FR:
  title: 'Erreur de votre système'
  description: "Un problème semble s'être produit sur votre machine"
  textButton: "Retour à la page d'accueil"
  errorName: '400'
  errorText: 'Mauvaise requête'
</i18n>
