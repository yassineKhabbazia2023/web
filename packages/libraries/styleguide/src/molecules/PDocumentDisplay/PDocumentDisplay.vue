<template>
  <div class="preview-section">
    <div v-if="isImage && !isLoadingDocument" class="preview-section_image">
      <ElImage :src="url" fit="fill" />
    </div>
    <div v-if="!isProvidedExtensionSupported && !isLoadingDocument" class="preview-section_notAllowed">
      <PImage
        class="preview-section_notAllowed_image"
        pType="paupulse"
        pName="document-error"
      />
      <div>
        <PText
          :pContent="errorMsgTitle"
          pType="primary"
          class="text-section_title"
          pBold
        />
        <PText
          :pContent="errorMsgText"
          pType="primary"
          class="text-section_second"
        />
      </div>
    </div>
    <div v-else-if="isLoadingDocument" class="preview-section__loader-container">
      <PLoader pType="gradient" pSize="50" />
    </div>
    <iframe
      v-else-if="isPdf"
      :src="url"
      title="pdf-preview"
      class="preview"
      data-test="document-preview-iframe"
    />
  </div>
</template>

<script lang="ts" setup>
import { ElImage } from 'element-plus'
import PImage from '../../atoms/PImage'
import PText from '../../atoms/PText'
import type { PDocumentDisplayProps, DocumentPreviewResponse } from './PDocumentDisplayTypes'
import PLoader from '../../atoms/PLoader'
import { computed } from 'vue'
import { isImageDocument, isPdfDocument } from '@pulse/core'
import type { FileExtension } from '@pulse/core/types'

const props = defineProps<PDocumentDisplayProps>()

const isLoadingDocument = computed(() => props.pIsLoading)
const isImage = computed(() => {
  return isImageDocument(props.pDocumentExtension)
})
const isPdf = computed(() => isPdfDocument(props.pDocumentExtension))
const isProvidedExtensionSupported = computed(() => !isNotImageOrPdf(props.pDocumentExtension))
const createBase64Image = (response: DocumentPreviewResponse): string => {
  const image = btoa(
    new Uint8Array(response.data).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      '',
    ),
  )

  return `data:${response.headers[
    'content-type'
  ].toLowerCase()};base64,${image}`
}
const url = computed(() => {
  if (typeof props.pSrc === 'string') {
    return props.pSrc
  } else if (props.pSrc instanceof Blob) {
    const urlStr = URL.createObjectURL(props.pSrc)
    return `${urlStr}#view=fit`
  } else {
    return createBase64Image(props.pSrc)
  }
})

const isNotImageOrPdf = (extension?: FileExtension): boolean => {
  return !isImageDocument(extension) && !isPdfDocument(extension)
}
</script>

<style lang="scss" scoped>
iframe.preview {
  height: 100%;
  width: 100%;
}

.preview-section {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  height: inherit;

  &_image {
    max-width: 70%;
  }

  &_notAllowed {
    display: flex;
    width: 320px;
    height: 320px;
    padding: 0px 40px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: var(--el-border-radius-base);
    background: #FFFFFF1F;
    backdrop-filter: blur(4px);

    &_image {
      width: 221px;
      height: 210px;
    }
  }
}

.text-section_title {
  color: var(--el-color-white);
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 120%;
  padding: 0;
  min-height: initial;
  justify-content: center;
  margin-bottom: 5px;
}

.text-section_second {
  color: var(--el-color-white);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
  padding: 0;
  min-height: initial;
}
</style>
