<template>
  <div v-if="pLabel" class="margin-bottom--1 font-bold">
    {{ pLabel }}
  </div>
  <ElUpload
    v-if="isSingleFileUploaded === false"
    ref="uploadElement"
    v-model:file-list="files"
    class="p-upload"
    :class="pClassMapper"
    v-bind="$attrs"
    :httpRequest="emitFilesEvent"
    :multiple="pMultiple"
    :showFileList="displayedFileList"
    :drag="pDrag"
    :disabled="pDisabled"
    :action="pAction"
    :onChange="handleFileChange"
  >
    <slot v-if="pUploadType === PUploadType.SLOT" />
    <div
      v-else
      class="
        p-upload__input
        flex flex--align-items-center flex--justify-content-center
      "
    >
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
    <!-- File-list variant: one line per file, shown below the drop zone (which stays visible). -->
    <template v-if="displayedFileList" #file="{ file }">
      <PUploadFileLine
        :pFile="file"
        :pStatus="file.status"
        :pMessage="getRejectionMessage(file)"
        :pIconName="getIconName(file.name, 'filetypeNone')"
        pHasButton
        pButtonIconName="trash"
        :pTitleButton="pDeleteButtonTitle"
        :pColor="pColorFileLine"
        @on-click-file-action="removeFile(file)"
      />
    </template>
  </ElUpload>
  <!-- Single-file variant: replaces the drop zone entirely (FILE_LINE mono mode, see isSingleFileUploaded). -->
  <PUploadFileLine
    v-else
    pIsMultiLine
    :pStatus="singleFileDisplayedStatus"
    :pMessage="getRejectionMessage(files[0])"
    :pFile="files[0]"
    :pIconName="getIconName(files[0].name, 'filetypeNone')"
    pHasButton
    pButtonIconName="trash"
    :pTitleButton="pDeleteButtonTitle"
    data-testid="upload-single-file"
    v-bind="$attrs"
    @on-click-file-action="removeFile(files[0])"
  />
</template>

<script setup lang="ts">
import { ElUpload, type UploadFile, type UploadRawFile } from 'element-plus'
import { ref, computed, watch } from 'vue'
import { isNullOrEmpty } from '@pulse/toolbox/utils/validator'
import { getIconName } from '../../utils/fileExtension'
import { getFileRejectionMessage } from './PUploadUtils'
import PUploadFileLine from '../../atoms/PUploadFileLine'
import { UploadFileStatus } from '../../constants/uploadStatus.const'
import type { UploadProps } from './PUploadTypes'
import { PUploadType } from './PUpload.enums'

defineOptions({ inheritAttrs: false })

const uploadElement = ref<InstanceType<typeof ElUpload> | null>(null)

function removeFile(file: UploadFile | UploadRawFile) {
  uploadElement.value?.handleRemove(file)
  files.value = files.value.filter((current) => current.uid !== file.uid)
  emit('delete-file', file)
}

const props = withDefaults(defineProps<UploadProps>(), {
  pUploadType: PUploadType.SLOT,
  pShowFileList: false,
  pAction: '#',
  pShouldClearPreviousFilesListOnUpload: false,
  pDeleteButtonTitle: 'Supprimer le document',
  pRejectedFileMessage: 'Extension non supportée',
})

const emit = defineEmits<{
  'files-selected': [File[]]
  'delete-file': [UploadFile | UploadRawFile]
}>()

const files = ref<UploadFile[]>(props.pInitialFiles ?? [])

const isSingleFileUploaded = computed(() =>
  props.pUploadType === PUploadType.FILE_LINE
  && props.pMultiple !== true
  && files.value.length > 0,
)

const displayedFileList = computed(() =>
  props.pShowFileList === true && isSingleFileUploaded.value === false,
)

// Neutral `ready` look for accepted files, error look only when rejected.
const singleFileDisplayedStatus = computed(() =>
  files.value[0]?.status === UploadFileStatus.FAIL
    ? UploadFileStatus.FAIL
    : UploadFileStatus.READY,
)

const pClassMapper = computed(() => ({
  [`p-upload--type-${props.pUploadType}`]: true,
  'p-upload--disabled': props.pDisabled,
}))

function clearFiles() {
  uploadElement.value?.clearFiles()
}

defineExpose({
  clearFiles,
})

// `pAccept` is set on the native input (file picker pre-filtering) rather than
// passed to ElUpload's `accept` prop, which would also make the dragger silently
// drop non-matching files — we want them to reach handleFileChange and show an error.
watch([uploadElement, () => props.pAccept], () => {
  const acceptValue = props.pAccept
  if (uploadElement.value === null || isNullOrEmpty(acceptValue)) {
    return
  }
  const nativeInputElement = (uploadElement.value.$el as HTMLElement).querySelector('input.el-upload__input')
  nativeInputElement?.setAttribute('accept', acceptValue)
})

const buildRejectionOptions = () => ({
  accept: props.pAccept,
  maxFileSizeInMo: props.pMaxFileSize,
  rejectedFileMessage: props.pRejectedFileMessage,
})

// Runs on every change: the fake httpRequest flips rejected files to `success`,
// so re-marking them as failed on each onChange is required.
const handleFileChange = (uploadFile: UploadFile) => {
  if (getFileRejectionMessage(uploadFile, buildRejectionOptions()) !== undefined) {
    uploadFile.status = UploadFileStatus.FAIL
  }
}

// Error-line message for a failed file (extension or size reason).
const getRejectionMessage = (file: UploadFile) =>
  file.status === UploadFileStatus.FAIL
    ? getFileRejectionMessage(file, buildRejectionOptions())
    : undefined

const emitFilesEvent = () => {
  const filesToUpload = files.value
    .filter((file) => file.status !== UploadFileStatus.FAIL)
    .map((file) => file.raw as File)
  return new Promise((resolve) => {
    resolve(emit('files-selected', filesToUpload))
    if (props.pShouldClearPreviousFilesListOnUpload) {
      // Keep failed files: they were not emitted, so their error lines must stay.
      files.value = files.value.filter((file) => file.status === UploadFileStatus.FAIL)
    }
  })
}
</script>

