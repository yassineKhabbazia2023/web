<template>
  <PError
    :pDescription="t('description')"
    :pButtonText="t('textButton')"
    :pErrorName="t('errorName')"
    :pErrorText="t('errorText')"
    pIllustrationName="error-locked"
    @handle-click="redirectToHome"
  >
    <template #title>
      {{ t('title') }}
    </template>
    <template #footer>
      <div class="margin-bottom--4">
        <LegalLinks />
      </div>
      <SupportInfo />
    </template>
  </PError>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { PError } from '@pulse/styleguide'
import { useRedirection } from '@app/composables/useRedirection'
import LegalLinks from '@app/components/LegalLinks'
import SupportInfo from '@app/components/SupportInfo'
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const { redirectToHome } = useRedirection()
</script>

<i18n lang="yaml">
en-US:
  title: 'Oops... Unauthorised access'
  description: "It seems you don't have access to"
  textButton: 'Back to home page'
  errorName: '403'
  errorText: 'Unauthorised access'
fr-FR:
  title: 'Oups... Accès non autorisé'
  description: "Il semble que vous n'avez pas accès"
  textButton: "Retour à la page d'accueil"
  errorName: '403'
  errorText: 'Accès interdit'
</i18n>
