<template>
  <PDocumentViewer
    v-model="internalIsOpened"
    :pTitleDocument="offer.title"
    pActiveDocument=""
    pTotalDocuments=""
    pDirection="rtl"
    :pHasIcon="true"
    :pHasPagination="false"
    :pShowCloseButton="true"
    :pShowPreviousDocument="false"
    :pShowNextDocument="false"
  >
    <template #iconDocument>
      <PIcon pName="filetypePdf" />
    </template>
    <template #media>
      <PDocumentDisplay
        :pSrc="offerPdf"
        :pIsLoading="false"
        pDocumentExtension="pdf"
        :errorMsgTitle="t('errorMsgTitle')"
        :errorMsgText="t('errorMsgText')"
      />
    </template>
  </PDocumentViewer>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { PDocumentViewer, PDocumentDisplay, PIcon } from '@pulse/styleguide/components'
import type { CatalogDocumentViewerProps } from './catalog-document-viewer.types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<CatalogDocumentViewerProps>()

const emit = defineEmits<{
    'update:is-opened': [boolean]
}>()
const internalIsOpened = computed({
  get: () => props.isOpened,
  set: (value) => {
    emit('update:is-opened', value)
  },
})
</script>

<i18n lang="yaml">
en-US:
    errorMsgTitle: 'Preview unavailable'
    errorMsgText: "The document format is not supported"
fr-FR:
    errorMsgTitle: 'Aperçu indisponible'
    errorMsgText: "Le format de document n'est pas supporté"
</i18n>
