<template>
  <CatalogStatusMessage
    :message="t('theDocumentDidNotLoad')"
    iconName="exclamationTriangle"
  >
    <p
      class="text-center"
    >
      {{ t('pleaseRefresh') }}
    </p>
  </CatalogStatusMessage>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CatalogStatusMessage from '../catalog-status-message/catalog-status-message.vue'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      theDocumentDidNotLoad: 'The document did not load correctly.',
      pleaseRefresh: 'Please refresh the page to restart the display.',
    },
    'fr-FR': {
      theDocumentDidNotLoad: 'Le document ne s’est pas chargé correctement.',
      pleaseRefresh: 'Veuillez rafraîchir la page pour relancer l’affichage',
    },
  },
})
</script>

