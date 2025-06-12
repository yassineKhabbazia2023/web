<template>
  <div
    class="flex
      flex--direction-column
      flex--align-items-center
      padding-top--12
      text-color--base-blue-pulse
    "
  >
    <PIcon
      pName="exclamationTriangle"
      pSize="24"
      class="margin-bottom--4"
    />
    <p
      class="font-bold text-center"
    >
      {{ t('theDocumentDidNotLoad') }}
    </p>
    <p
      class="text-center"
    >
      {{ t('pleaseRefresh') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PIcon } from '@pulse/styleguide/components'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})
</script>

<i18n lang="yaml">
  en-US:
    theDocumentDidNotLoad: 'The document did not load correctly.'
    pleaseRefresh: 'Please refresh the page to restart the display.'
  fr-FR:
    theDocumentDidNotLoad: 'Le document ne s’est pas chargé correctement.'
    pleaseRefresh: 'Veuillez rafraîchir la page pour relancer l’affichage'
</i18n>
