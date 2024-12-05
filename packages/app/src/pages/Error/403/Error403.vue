<template>
  <PError
    :pDescription="t('description')"
    :pButtonText="t('textButton')"
    :pErrorName="t('errorName')"
    :pErrorText="t('errorText')"
    pIllustrationName="error-locked"
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
  title: 'Unauthorised access'
  description: "It appears that you do not have the necessary access rights."
  textButton: 'Back to home page'
  errorName: '403'
  errorText: 'Unauthorised access'
fr-FR:
  title: 'Accès non autorisé'
  description: "Il semblerait que vous n'ayez pas les droits d'accès"
  textButton: "Retour à la page d'accueil"
  errorName: '403'
  errorText: 'Accès interdit'
</i18n>
