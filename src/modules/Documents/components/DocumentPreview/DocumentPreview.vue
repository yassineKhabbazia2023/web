<!-- eslint-disable no-undef -->
<!-- eslint-disable max-len -->
<template>
  <PDocumentViewer
    v-model="isDrawerOpened"
    pSize="100%"
    pDirection="rtl"
    :pTitleDocument="document.name"
    :pActiveDocument="selectedDocumentIndex"
    :pTotalDocuments = "totalDocumentsCount"
    pShowClose
    pDestroyOnClose
    pHasIcon
    pHasPagination
    pShowCloseButton
    :pShowPreviousDocument = "selectedDocumentIndex > 1"
    :pShowNextDocument = "selectedDocumentIndex < totalDocumentsCount"
    @next-document-button-click="handleNextButtonClick"
    @previous-document-button-click="handlePreviousButtonClick"
  >
<template #iconDocument>
    <PIcon>
      <component :is="getFileIcon(document.name)" />
    </PIcon>
  </template>
<template #media>
      <img
          :src="previewImage"
          alt="preview-image"
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
import { PDocumentViewer, PIcon } from '@kpmg/styleguide'
import { DocumentsPreviewProps } from './DocumentPreviewTypes'
import { previewDocument } from '@/services/Documents'
import { createBase64Image, getFileIcon } from '../../helpers/filesExtensions'
import DocumentsTabs from '@/modules/Documents/sections/DocumentsList/components/DocumentTabs'

const props = defineProps<DocumentsPreviewProps>()
const emit = defineEmits([
  'update:modelValue',
  'next-document-preview-button-click',
  'previous-document-preview-button-click'
])

const isDrawerOpened = computed({
  get() {
    return props.openDrawer
  },
  set(value: boolean) {
    emit('update:modelValue', value)
  }
})
const previewImage = ref('')

const fetchPreview = async () => {

  if (props.serviceId && props.entityId && props.document.id) {
    const response = await previewDocument(
      props.serviceId,
      props.entityId,
      props.document.id
    )
    previewImage.value = createBase64Image(response)
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
  }
)
</script>
