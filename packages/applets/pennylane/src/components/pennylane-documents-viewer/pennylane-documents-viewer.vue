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
      <div
        class="
          flex
          flex--direction-column
          height--100
          flex--justify-content-space-between
        "
      >
        <PennylaneDocumentsDetails
          v-if="pennylaneDocument !== undefined"
          :pennylaneDocument="pennylaneDocument"
          class="flex-grow"
        />
        <div
          class="
            margin-top--4
            flex
            flex--justify-content-flex-end
          "
        >
          <PButton
            pType="secondary"
            class="drawer-download-button"
            pSize="default"
            :pLoading="isDownloading"
            :pDisabled="isDownloadButtonDisabled"
            pPlain
            @click="onClickDownload"
          >
            <PIcon class="el-button__icon--left" pName="download" />
            {{ t('label.download') }}
          </PButton>
        </div>
      </div>
    </template>
  </PDocumentViewer>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDocumentViewer, PDocumentDisplay, PIcon, PButton } from '@pulse/styleguide/components'
import { APICallStatus } from '@pulse/common/enums'
import { usePennylaneDocumentViewer } from './pennylane-documents-viewer.composable'
import type { PennylaneDocumentsViewerProps } from './pennylane-documents-viewer.types'
import PennylaneDocumentsDetails from '../pennylane-documents-details/pennylane-documents-details.vue'
import { downloadDocument } from '@pennylane/helpers/pennylane-documents.helper'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<PennylaneDocumentsViewerProps>()

const emit = defineEmits<{
    'update:is-opened': [boolean]
}>()

const isDownloading = ref(false)

const internalIsOpened = computed({
  get: () => props.isOpened,
  set: (value) => {
    emit('update:is-opened', value)
  },
})

const {
  documentSrc,
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
      accountId: props.accountId,
      documentName: name ?? '',
      documentId: id ?? 0,
    })
  }
}, {
  immediate: true,
})

async function onClickDownload() {
  isDownloading.value = true
  await downloadDocument({
    documentSrc: documentSrc.value,
    documentName: props.pennylaneDocument?.name ?? '',
    successMessage: t('messages.download-success'),
    errorMessage: t('messages.download-error'),
  })
  isDownloading.value = false
}

const isDownloadButtonDisabled = computed(() => (
  documentSrc.value === undefined || isDownloading.value === true
))
</script>

<i18n lang="yaml">
en-US:
    errorMsgTitle: 'Preview unavailable'
    errorMsgText: "The document format is not supported"
    errorWhileLoading: >
      An error occurred while loading the document content.
      Please try again later.
    label:
      download: 'Download'
    messages:
      download-success: 'Document downloaded successfully'
      download-error: 'A technical error occurred while downloading the document'
fr-FR:
    errorMsgTitle: 'Aperçu indisponible'
    errorMsgText: "Le format de document n'est pas supporté"
    errorWhileLoading: >
      Une erreur est survenue lors du chargement du contenu du document.
      Veuillez réessayer ultérieurement s'il vous plaît.
    label:
      download: 'Télécharger'
    messages:
      download-success: 'Document téléchargé avec succès'
      download-error: 'Une erreur technique est survenue lors du téléchargement du document'
</i18n>
