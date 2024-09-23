<template>
  <PError
    :pDescription="t('description')"
    :pButtonText="t('textButton')"
    :pErrorName="t('errorName')"
    :pErrorText="t('errorText')"
    pIllustrationName="error-generic"
    @handle-click="redirectToHome"
  >
    <template #title>
      {{ t('title1') }}
      <br />
      {{ t('title2') }}
      <span class="text-color--persian-500">{{ t('title3') }}</span>
      {{ t('title4') }}
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
import { PError } from '@kpmg/styleguide'
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
  title1: 'Mayday, mayday... '
  title2: 'Error in '
  title3: 'your'
  title4: ' system'
  description: 'You seem to have a problem'
  textButton: 'Back to home page'
  errorName: '400'
  errorText: 'Customer-side error'
fr-FR:
  title1: 'Mayday, mayday... '
  title2: 'Erreur de '
  title3: 'votre'
  title4: ' système'
  description: 'Il semble que vous ayez un problème'
  textButton: "Retour à la page d'accueil"
  errorName: '400'
  errorText: 'Erreur coté client'
</i18n>
