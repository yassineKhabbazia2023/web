<template>
  <div v-if="pLabel" class="margin-bottom--1 font-bold">
    {{ pLabel }}
  </div>
  <ElUpload
    v-if="isFull === false"
    ref="uploadElement"
    v-model:file-list="uploadFiles"
    class="p-upload p-upload--type-dragger"
    :class="{ 'p-upload--disabled': pDisabled }"
    :data-testid="pTestId"
    v-bind="$attrs"
    drag
    :multiple="false"
    :limit="1"
    :autoUpload="false"
    :showFileList="false"
    :disabled="pDisabled"
    :onExceed="notifyMaxFilesExceeded"
  >
    <div
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
  <!-- Full state: the drop zone is replaced by a single boxed file line. -->
  <PUploadFileLine
    v-else-if="rejectedEntry !== undefined"
    pIsMultiLine
    :pStatus="UploadFileStatus.FAIL"
    :pMessage="rejectedEntry.message"
    :pFileName="rejectedEntry.fileName"
    :pIconName="getIconName(rejectedEntry.fileName, 'filetypeNone')"
    pHasButton
    pButtonIconName="trash"
    :pTitleButton="pDeleteButtonTitle"
    data-testid="upload-rejected-file"
    v-bind="$attrs"
    @on-click-file-action="dismissRejectedEntry(rejectedEntry.uid)"
  />
  <PUploadFileLine
    v-else-if="pUploadedFile !== undefined"
    pIsMultiLine
    :pStatus="isUploadedFileDeleting ? UploadFileStatus.UPLOADING : UploadFileStatus.SUCCESS"
    :pFileName="pUploadedFile.fileName"
    :pIconName="getIconName(pUploadedFile.fileName, 'filetypeNone')"
    :pHasButton="pCanDeleteUploadedFile"
    pButtonIconName="trash"
    :pTitleButton="pDeleteButtonTitle"
    data-testid="upload-uploaded-file"
    v-bind="$attrs"
    @on-click-file-action="onUploadedFileDeleteRequested"
  />
  <PUploadFileLine
    v-else-if="model !== null"
    pIsMultiLine
    :pStatus="UploadFileStatus.READY"
    :pFileName="model.name"
    :pIconName="getIconName(model.name, 'filetypeNone')"
    pHasButton
    pButtonIconName="trash"
    :pTitleButton="pDeleteButtonTitle"
    data-testid="upload-pending-file"
    v-bind="$attrs"
    @on-click-file-action="model = null"
  />
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
import { ElUpload } from 'element-plus'
import type { UploadFile, UploadInstance } from 'element-plus'
import { ref, computed, watch, useTemplateRef } from 'vue'
import { getIconName } from '../../utils/fileExtension'
import PUploadFileLine from '../../atoms/PUploadFileLine'
import PConfirmationPopup from '../../organisms/PConfirmationPopup'
import { UploadFileStatus } from '../../constants/uploadStatus.const'
import { useUploadCore } from './PUploadCore.composable'
import {
  DELETE_CONFIRMATION_CANCEL_LABEL,
  DELETE_CONFIRMATION_CONFIRM_LABEL,
  DELETE_CONFIRMATION_MESSAGE,
  DELETE_CONFIRMATION_TITLE,
  MAX_FILES_EXCEEDED_MESSAGE,
  REMOTE_DELETE_ERROR_MESSAGE,
} from './PUpload.constants'
import type { PUploadProps } from './PUploadTypes'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<PUploadProps>(), {
  pRejectedFileMessage: 'Extension non supportée, le fichier ne sera pas enregistré',
  pMaxFilesExceededMessage: MAX_FILES_EXCEEDED_MESSAGE,
  pDeleteButtonTitle: 'Supprimer le document',
  pCanDeleteUploadedFile: true,
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

// The pending selection. Persisted documents live in `pUploadedFile` and never
// enter the model.
const model = defineModel<File | null>({ default: null })

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
  uploadedFileIds: computed(() => props.pUploadedFile === undefined ? [] : [props.pUploadedFile.id]),
})

const isUploadedFileDeleting = computed(() =>
  props.pUploadedFile !== undefined
  && deletingUploadedFileIds.value.has(props.pUploadedFile.id),
)

const isDeleteConfirmationVisible = ref(false)

const onUploadedFileDeleteRequested = () => {
  const uploadedFile = props.pUploadedFile
  if (uploadedFile === undefined) {
    return
  }
  if (isRemoteDeleteEnabled.value === false) {
    emit('delete-uploaded-file', uploadedFile.id)
    return
  }
  isDeleteConfirmationVisible.value = true
}

// The popup closes as soon as the deletion is confirmed: the ongoing call is
// materialized by the file line spinner, and a failure by the error toast.
const onDeleteConfirmed = async () => {
  isDeleteConfirmationVisible.value = false
  const uploadedFile = props.pUploadedFile
  if (uploadedFile === undefined) {
    return
  }
  const outcome = await deleteUploadedFileRemotely(uploadedFile.id)
  if (outcome === 'deleted') {
    emit('uploaded-file-deleted', uploadedFile.id)
  } else if (outcome === 'unavailable') {
    emit('delete-uploaded-file', uploadedFile.id)
  }
}

const rejectedEntry = computed(() => rejectedEntries.value[0])

const isFull = computed(() =>
  rejectedEntry.value !== undefined
  || props.pUploadedFile !== undefined
  || model.value !== null,
)

// element-plus plumbing only: the selected file is moved to the model (or to a
// rejected entry) as soon as the selection settles, and the list is emptied so
// the remounted drop zone starts from a clean single-file slot.
const uploadFiles = ref<UploadFile[]>([])

watch(uploadFiles, (currentFiles) => {
  if (currentFiles.length === 0) {
    return
  }
  const selectedFile = currentFiles[0]
  if (tryAcceptFile(selectedFile) === true && selectedFile.raw instanceof File) {
    model.value = selectedFile.raw
  }
  uploadFiles.value = []
})
</script>
