<template>
  <div class="documents-search-alert padding-x--4">
    <PAlert v-if="documentsCount > 0" pType="information">
      <template #bold-text>
        {{ t('documentsFound.highlightedText', { count: documentsCount }) }}
      </template>
      {{ t('documentsFound.normalText') }}
    </PAlert>
    <div
      v-else
      class="documents-search-alert__no-documents
        font-semibold padding-y--2 padding-x--6"
    >
      <span>{{ documentsCount }}</span> {{ t('documentsNotFound') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DocumentsSearchAlertProps } from './DocumentsSearchAlertTypes'
import { useI18n } from 'vue-i18n'
import { PAlert } from '@pulse/styleguide/components'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      documentsFound: {
        highlightedText: '{count} résultats',
        normalText: 'dans ce dossier et ses sous-dossiers',
      },
      documentsNotFound: 'Résultats dans ce dossier et les sous-dossiers',
    },
    'fr-FR': {
      documentsFound: {
        highlightedText: '{count} résultats',
        normalText: 'dans ce dossier et ses sous-dossiers',
      },
      documentsNotFound: 'Résultats dans ce dossier et les sous-dossiers',
    },
  },
})

defineProps<DocumentsSearchAlertProps>()
</script>

<style lang="scss">
.documents-search-alert {
  padding-top: 8px;
  &__no-documents {
    color: var(--p-gray-500);

    span {
      color: var(--p-gray-900);
    }
  }
}
</style>

