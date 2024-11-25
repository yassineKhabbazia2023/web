<template>
  <PDocumentViewer
    v-model="isDrawerOpened"
    pSize="100%"
    pDirection="rtl"
    :pTitleDocument="document.name"
    :pActiveDocument="selectedDocumentIndex"
    :pTotalDocuments="totalDocumentsCount"
    :pShowClose="false"
    pDestroyOnClose
    pHasIcon
    pHasPagination
    pShowCloseButton
    :pShowPreviousDocument="selectedDocumentIndex > 1"
    :pShowNextDocument="selectedDocumentIndex < totalDocumentsCount"
    @update:model-value="handleClose"
    @next-document-button-click="handleNextButtonClick"
    @previous-document-button-click="handlePreviousButtonClick"
  >
    <template #iconDocument>
      <PIcon>
        <component :is="getFileIcon(document.name)" />
      </PIcon>
    </template>
    <template #media>
      <PDocumentDisplay
        :pSrc="previewImage"
        :pIsLoading="isLoadingDocument"
        :pDocumentExtension="documentExtension"
        :errorMsgTitle="t('errorTitle')"
        :errorMsgText="t('errorMessage')"
      />
    </template>
    <template #content>
      <DocumentsTabs
        :document="document"
        :selectedEntity="entityId"
        :currentService="serviceId"
      />
    </template>
  </PDocumentViewer>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { PDocumentViewer, PIcon, PDocumentDisplay } from '@pulse/styleguide/components'
import type { DocumentsPreviewProps } from './DocumentPreviewTypes'
import type { DocumentPreviewResponse } from '@ged/services/Documents'
import { downloadDocument, previewDocument } from '@ged/services/Documents'
import { getFileExtension, getFileIcon, isImageDocument }
  from '../../helpers/filesExtensions'
import DocumentsTabs from '@ged/modules/Documents/sections/DocumentsList/components/DocumentTabs'
import { useI18n } from 'vue-i18n'

const props = defineProps<DocumentsPreviewProps>()
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const isLoadingDocument = ref(true)
const documentExtension = computed(() => getFileExtension(props.document.name))
const emit = defineEmits([
  'update:modelValue',
  'next-document-preview-button-click',
  'previous-document-preview-button-click',
  'close-drawer',
])

const isDrawerOpened = computed({
  get() {
    return props.openDrawer
  },
  set(value: boolean) {
    emit('update:modelValue', value)
  },
})
const previewImage = ref<string|Blob|DocumentPreviewResponse>('')

const fetchPreview = async () => {
  if (props.serviceId && props.entityId && props.document.id) {
    isLoadingDocument.value = true
    try {
      if (isImageDocument(documentExtension.value)) {
        const response = await previewDocument(
          props.serviceId,
          props.entityId,
          props.document.id,
        )
        if (response) {
          previewImage.value = response
          isLoadingDocument.value = false
        }
      } else {
        const responseBlob = await downloadDocument(
          props.serviceId,
          props.entityId,
          props.document.id,
        )
        if (responseBlob) {
          previewImage.value = responseBlob
          isLoadingDocument.value = false
        }
      }
    } catch (e) {
      isLoadingDocument.value = false
      previewImage.value = ''
    }
  }
}

const handleNextButtonClick = () => {
  emit('next-document-preview-button-click')
}
const handlePreviousButtonClick = () => {
  emit('previous-document-preview-button-click')
}
onMounted(() => {
  fetchPreview()
})

watch(
  () => [props.serviceId, props.entityId, props.document.id],
  () => {
    fetchPreview()
  },
)

const handleClose = () => {
  emit('close-drawer')
}
</script>

<style lang="scss" scoped>
.preview-image{
  height:auto;
  max-height:100%;
  max-width:100%
}
</style>
<i18n lang="yaml">
en-US:
  errorTitle: Aperçu indisponible
  errorMessage: Le format de document n'est pas supporté

fr-FR:
  errorTitle: Aperçu indisponible
  errorMessage: Le format de document n'est pas supporté
</i18n>
