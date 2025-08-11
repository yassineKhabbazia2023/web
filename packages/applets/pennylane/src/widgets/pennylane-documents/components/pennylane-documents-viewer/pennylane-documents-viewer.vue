<template>
  <PDocumentViewer
    v-model="internalIsOpened"
    :pTitleDocument="pennylaneDocument?.name ?? ''"
    pActiveDocument=""
    pTotalDocuments=""
    :pHasIcon="true"
    :pHasPagination="false"
    :pShowCloseButton="true"
    :pShowPreviousDocument="false"
    :pShowNextDocument="false"
  >
    <template #iconDocument>
      <PIcon
        v-if="iconName !== undefined"
        :pName="iconName"
      />
    </template>

    <template #media>
      <PDocumentDisplay
        v-if="previewImage !== ''"
        :pSrc="previewImage"
        :pIsLoading="apiCallStatus === APICallStatus.LOADING"
        :pDocumentExtension="fileExtension"
        :errorMsgTitle="t('errorMsgTitle')"
        :errorMsgText="t('errorMsgText')"
      />
    </template>

    <template #content>
      <PennylaneDocumentsDetails
        v-if="pennylaneDocument !== undefined"
        :pennylaneDocument="pennylaneDocument"
      />
    </template>
  </PDocumentViewer>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDocumentViewer, PDocumentDisplay, PIcon } from '@pulse/styleguide/components'
import { APICallStatus } from '@pulse/common/enums'
import { usePennylaneDocumentViewer } from './pennylane-documents-viewer.composable'
import type { PennylaneDocumentsViewerProps } from './pennylane-documents-viewer.types'
import PennylaneDocumentsDetails from '../pennylane-documents-details/pennylane-documents-details.vue'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<PennylaneDocumentsViewerProps>()

const emit = defineEmits<{
    'update:is-opened': [boolean]
}>()

const internalIsOpened = computed({
  get: () => props.isOpened,
  set: (value) => {
    emit('update:is-opened', value)
  },
})

const {
  apiCallStatus,
  iconName,
  previewImage,
  fileExtension,
  loadDocument,
} = usePennylaneDocumentViewer(t('errorWhileLoading'))

watch(() => props.isOpened && props.pennylaneDocument?.id, () => {
  if (props.isOpened === true && props.pennylaneDocument !== undefined) {
    const {
      name,
      id,
    } = props.pennylaneDocument

    loadDocument({
      accountNumber: props.accountNumber,
      documentName: name ?? '',
      documentId: id ?? 0,
    })
  }
}, {
  immediate: true,
})
</script>

<i18n lang="yaml">
en-US:
    errorMsgTitle: 'Preview unavailable'
    errorMsgText: "The document format is not supported"
    errorWhileLoading: >
      An error occurred while loading the document content.
      Please try again later.
fr-FR:
    errorMsgTitle: 'Aperçu indisponible'
    errorMsgText: "Le format de document n'est pas supporté"
    errorWhileLoading: >
      Une erreur est survenue lors du chargement du contenu du document.
      Veuillez réessayer ultérieurement s'il vous plaît.
</i18n>
