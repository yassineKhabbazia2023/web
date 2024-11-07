<template>
  <ElUpload
    ref="uploadElement"
    class="p-upload"
    :class="pClassMapper"
    :httpRequest="emitFilesEvent"
    v-model:file-list="files"
    :multiple="pMultiple"
    :showFileList="pShowFileList"
    :drag="pDrag"
    :disabled="pDisabled"
    :accept="pAccept"
    :action="pAction"
  >
    <slot v-if="pUploadType === 'slot'" />
    <div v-else class="p-upload__input flex flex--align-items-center">
      <PIcon
        v-if="pUploadType === 'file-line'"
        :color="AppColors.PRIMARY"
        size="16"
        class="margin-right--2"
       pName="upload" />
      <PImage
        v-if="pUploadType === 'dragger'"
        class="p-upload__img margin-bottom--3"
        pType="paupulse"
        pName="document-import"
      />
      <span data-testid="upload-input-content">
        {{ pPrefixLabelFileLine }}
        <span
          class="font-semibold"
          :class="
            pDisabled
              ? 'text-color--neutral-gray-500'
              : 'text-color--persian-500'
          "
        >
          {{ pSuffixLabelFileLine }}
        </span>
        <span class="p-upload__format-size">
          {{ pAuthorizedFileFormat }} (max. {{ pTextLimitSize }})
        </span>
      </span>
    </div>
    <template v-if="pShowFileList" #file="{ file }">
      <PUploadFileLine
        :pFile="file"
        :pStatus="file.status"
        :pIcon="getFileIcon(file.name)"
        pHasButton
        pButtonIcon="PITrash"
        pTitleButton="Supprimer le document"
        :pColor="pColorFileLine"
        @on-click-file-action="removeFile(file)"
      />
    </template>
  </ElUpload>
</template>

<script setup lang="ts">
import { ElUpload, type UploadFile, type UploadRawFile } from 'element-plus'
import { ref, computed } from 'vue'
import { getFileIcon } from '@styleguide/utils/fileExtension'
import PIcon from '@styleguide/atoms/PIcon'
import PImage from '@styleguide/atoms/PImage'
import PUploadFileLine from '@styleguide/atoms/PUploadFileLine'
import type { UploadProps } from './PUploadTypes'
import { AppColors } from '@styleguide/utils/AppColorsEnum'

const uploadElement = ref<InstanceType<typeof ElUpload> | null>(null)

function removeFile(file: UploadFile | UploadRawFile) {
  uploadElement.value?.handleRemove(file)
  emit('delete-file', file)
}

const props = withDefaults(defineProps<UploadProps>(), {
  pUploadType: 'slot',
  pShowFileList: false,
  pAction: '#',
  pShouldClearPreviousFilesListOnUpload: false,
})

const pClassMapper = computed(() => ({
  [`p-upload--type-${props.pUploadType}`]: true,
  'p-upload--disabled': props.pDisabled,
}))

const emit = defineEmits<{
  'files-selected': [File[]]
  'delete-file': [UploadFile | UploadRawFile]
}>()

const files = ref<UploadFile[]>([])

function clearFiles() {
  uploadElement.value?.clearFiles()
}

defineExpose({
  clearFiles,
})

const emitFilesEvent = () => {
  const filesToUpload = files.value.map((file) => file.raw as File)
  return new Promise((resolve) => {
    resolve(emit('files-selected', filesToUpload))
    if (props.pShouldClearPreviousFilesListOnUpload) {
      files.value = []
    }
  })
}
</script>
