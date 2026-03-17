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
  messages: {
    'en-US': {
      title: 'Unauthorized access',
      description: 'It appears that you do not have the necessary access rights.',
      textButton: 'Back to home page',
      errorName: '403',
      errorText: 'Unauthorized access',
    },
    'fr-FR': {
      title: 'Accès non autorisé',
      description: 'Il semblerait que vous n\'ayez pas les droits d\'accès',
      textButton: 'Retour à la page d\'accueil',
      errorName: '403',
      errorText: 'Accès interdit',
    },
  },
})

const router = useRouter()

const redirectToHome = () => {
  router.push('/')
}
</script>

