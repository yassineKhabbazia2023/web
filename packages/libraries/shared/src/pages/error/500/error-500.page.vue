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
  title: 'There is an error in our system.'
  description: 'A problem has occurred on our end'
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
