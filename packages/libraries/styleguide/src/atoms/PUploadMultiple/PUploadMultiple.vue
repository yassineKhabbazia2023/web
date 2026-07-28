<template>
  <div v-if="pLabel" class="margin-bottom--1 font-bold">
    {{ pLabel }}
  </div>
  <ElUpload
    v-if="isDropZoneVisible"
    ref="uploadElement"
    v-model:file-list="uploadFiles"
    class="p-upload"
    :class="pClassMapper"
    v-bind="$attrs"
    :drag="hasTriggerSlot === false"
    :multiple="pMultiple"
    :limit="remainingSlotCount"
    :autoUpload="false"
    :showFileList="false"
    :disabled="pDisabled"
    :onExceed="notifyMaxFilesExceeded"
  >
    <slot v-if="hasTriggerSlot" />
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
  </ElUpload>
  <div
    v-if="hasDisplayedFileLines"
    class="p-upload__file-list"
    :class="{ 'margin-top--2': isDropZoneVisible }"
  >
    <PUploadFileLine
      v-for="uploadedFile in pUploadedFiles"
      :key="uploadedFile.id"
      :pStatus="deletingUploadedFileIds.has(uploadedFile.id) ? UploadFileStatus.UPLOADING : UploadFileStatus.SUCCESS"
      :pFileName="uploadedFile.fileName"
      :pIconName="getIconName(uploadedFile.fileName, 'filetypeNone')"
      :pHasButton="pCanDeleteUploadedFiles"
      pButtonIconName="trash"
      :pTitleButton="pDeleteButtonTitle"
      data-testid="upload-uploaded-file"
      @on-click-file-action="onUploadedFileDeleteRequested(uploadedFile.id)"
    />
    <PUploadFileLine
      v-for="(pendingFile, pendingFileIndex) in model"
      :key="pendingFileIndex"
      :pStatus="UploadFileStatus.READY"
      :pFileName="pendingFile.name"
      :pIconName="getIconName(pendingFile.name, 'filetypeNone')"
      pHasButton
      pButtonIconName="trash"
      :pTitleButton="pDeleteButtonTitle"
      data-testid="upload-pending-file"
      @on-click-file-action="removePendingFile(pendingFile)"
    />
    <PUploadFileLine
      v-for="rejectedEntry in rejectedEntries"
      :key="rejectedEntry.uid"
      :pStatus="UploadFileStatus.FAIL"
      :pMessage="rejectedEntry.message"
      :pFileName="rejectedEntry.fileName"
      :pIconName="getIconName(rejectedEntry.fileName, 'filetypeNone')"
      pHasButton
      pButtonIconName="trash"
      :pTitleButton="pDeleteButtonTitle"
      data-testid="upload-rejected-file"
      @on-click-file-action="dismissRejectedEntry(rejectedEntry.uid)"
    />
  </div>
  <PConfirmationPopup
    v-model:pIsVisible="isDeleteConfirmationVisible"
    :pTitle="pDeleteConfirmationTitle"
    :pConfirmButtonContent="pDeleteConfirmationConfirmLabel"
    :pCancelButtonContent="pDeleteConfirmationCancelLabel"
    @on-confirm-button-click="onDeleteConfirmed"
    @on-cancel-button-click="isDeleteConfirmationVisible = false"
  >
    {{ pDeleteConfirmationMessage }}
  </PConfirmationPopup>
</template>

<script setup lang="ts">
import { ElUpload, type UploadFile, type UploadInstance, type UploadRawFile } from 'element-plus'
import { ref, computed, watch, useSlots, useTemplateRef } from 'vue'
import { getIconName } from '../../utils/fileExtension'
import PUploadFileLine from '../PUploadFileLine'
import PConfirmationPopup from '../../organisms/PConfirmationPopup'
import { UploadFileStatus } from '../../constants/uploadStatus.const'
import { useUploadCore } from '../PUpload/PUploadCore.composable'
import { isSameFileList } from '../PUpload/PUploadUtils'
import {
  DELETE_CONFIRMATION_CANCEL_LABEL,
  DELETE_CONFIRMATION_CONFIRM_LABEL,
  DELETE_CONFIRMATION_MESSAGE,
  DELETE_CONFIRMATION_TITLE,
  MAX_FILES_EXCEEDED_MESSAGE,
  REMOTE_DELETE_ERROR_MESSAGE,
} from '../PUpload/PUpload.constants'
import type { PUploadMultipleProps } from './PUploadMultipleTypes'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<PUploadMultipleProps>(), {
  pUploadedFiles: () => [],
  pCanDeleteUploadedFiles: true,
  pMultiple: true,
  pRejectedFileMessage: 'Extension non supportée, le fichier ne sera pas enregistré',
  pMaxFilesExceededMessage: MAX_FILES_EXCEEDED_MESSAGE,
  pDeleteButtonTitle: 'Supprimer le document',
  pCanRemoteDelete: false,
  pRemoteDeleteErrorMessage: REMOTE_DELETE_ERROR_MESSAGE,
  pDeleteConfirmationTitle: DELETE_CONFIRMATION_TITLE,
  pDeleteConfirmationMessage: DELETE_CONFIRMATION_MESSAGE,
  pDeleteConfirmationConfirmLabel: DELETE_CONFIRMATION_CONFIRM_LABEL,
  pDeleteConfirmationCancelLabel: DELETE_CONFIRMATION_CANCEL_LABEL,
})

const emit = defineEmits<{
  'delete-uploaded-file': [id: string | number]
  'uploaded-file-deleted': [id: string | number]
}>()

// The pending selection, in insertion order. Persisted documents live in
// `pUploadedFiles` and never enter the model.
const model = defineModel<File[]>({ required: true })

const slots = useSlots()

// A default slot switches the component to picker mode: the slot content is
// the ElUpload trigger and the drop zone chrome disappears.
const hasTriggerSlot = computed(() => slots.default !== undefined)

const pClassMapper = computed(() => ({
  'p-upload--type-slot': hasTriggerSlot.value,
  'p-upload--type-dragger': hasTriggerSlot.value === false,
  'p-upload--disabled': props.pDisabled,
}))

const uploadElement = useTemplateRef<UploadInstance>('uploadElement')

const {
  rejectedEntries,
  tryAcceptFile,
  dismissRejectedEntry,
  notifyMaxFilesExceeded,
  isRemoteDeleteEnabled,
  deletingUploadedFileIds,
  deleteUploadedFileRemotely,
} = useUploadCore({
  uploadElement,
  accept: computed(() => props.pAccept),
  maxFileSizeInMo: computed(() => props.pMaxFileSize),
  rejectedFileMessage: computed(() => props.pRejectedFileMessage),
  maxFilesExceededMessage: computed(() => props.pMaxFilesExceededMessage),
  canRemoteDelete: computed(() => props.pCanRemoteDelete),
  remoteDeleteUrl: computed(() => props.pRemoteDeleteUrl),
  remoteDeleteErrorMessage: computed(() => props.pRemoteDeleteErrorMessage),
  uploadedFileIds: computed(() => props.pUploadedFiles.map((uploadedFile) => uploadedFile.id)),
})

const uploadedFileIdPendingDeletion = ref<string | number>()

const isDeleteConfirmationVisible = computed({
  get: () => uploadedFileIdPendingDeletion.value !== undefined,
  set: (isVisible: boolean) => {
    if (isVisible === false) {
      uploadedFileIdPendingDeletion.value = undefined
    }
  },
})

const onUploadedFileDeleteRequested = (uploadedFileId: string | number) => {
  if (isRemoteDeleteEnabled.value === false) {
    emit('delete-uploaded-file', uploadedFileId)
    return
  }
  uploadedFileIdPendingDeletion.value = uploadedFileId
}

// The popup closes as soon as the deletion is confirmed: the ongoing call is
// materialized by the file line spinner, and a failure by the error toast.
const onDeleteConfirmed = async () => {
  const uploadedFileId = uploadedFileIdPendingDeletion.value
  uploadedFileIdPendingDeletion.value = undefined
  if (uploadedFileId === undefined) {
    return
  }
  const outcome = await deleteUploadedFileRemotely(uploadedFileId)
  if (outcome === 'deleted') {
    emit('uploaded-file-deleted', uploadedFileId)
  } else if (outcome === 'unavailable') {
    emit('delete-uploaded-file', uploadedFileId)
  }
}

// element-plus counts its own file list against `limit`, so only the persisted
// documents are subtracted from the total cap here.
const remainingSlotCount = computed(() =>
  props.pMaxFiles === undefined
    ? undefined
    : props.pMaxFiles - props.pUploadedFiles.length,
)

const isDropZoneVisible = computed(() =>
  props.pMaxFiles === undefined
  || props.pUploadedFiles.length + model.value.length < props.pMaxFiles,
)

const hasDisplayedFileLines = computed(() =>
  props.pUploadedFiles.length > 0
  || model.value.length > 0
  || rejectedEntries.value.length > 0,
)

// element-plus plumbing: mirrors the pending selection. Kept in sync with the
// model in both directions; rejected files are evicted before they reach it.
const uploadFiles = ref<UploadFile[]>([])

// Validation and model sync run in a pre-flush watcher (one run per selection
// batch): mutating the bound file list from inside `on-change` would be
// overwritten by element-plus's own per-file appends within the same batch.
watch(uploadFiles, (currentFiles) => {
  const acceptedFiles: UploadFile[] = []
  for (const uploadFile of currentFiles) {
    const isAlreadyAccepted = model.value.includes(uploadFile.raw as File)
    if (isAlreadyAccepted || tryAcceptFile(uploadFile) === true) {
      acceptedFiles.push(uploadFile)
    }
  }
  if (acceptedFiles.length !== currentFiles.length) {
    uploadFiles.value = acceptedFiles
    return
  }
  const acceptedRawFiles = acceptedFiles
    .map((uploadFile) => uploadFile.raw)
    .filter((rawFile): rawFile is UploadRawFile => rawFile instanceof File)
  if (isSameFileList(model.value, acceptedRawFiles) === false) {
    model.value = acceptedRawFiles
  }
})

// Parent-side model writes (pending line removal, post-save reset) flow back
// into the element-plus list so the cap and future selections stay accurate.
watch(model, (currentModel) => {
  const remainingFiles = uploadFiles.value.filter(
    (uploadFile) => uploadFile.raw instanceof File && currentModel.includes(uploadFile.raw),
  )
  if (remainingFiles.length !== uploadFiles.value.length) {
    uploadFiles.value = remainingFiles
  }
})

const removePendingFile = (pendingFile: File) => {
  model.value = model.value.filter((file) => file !== pendingFile)
}
</script>
