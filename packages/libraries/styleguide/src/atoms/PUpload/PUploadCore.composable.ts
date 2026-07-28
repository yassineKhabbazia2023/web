import { computed, ref, watch } from 'vue'
import type { UploadFile } from 'element-plus'
import { logger } from '@pulse/toolbox'
import { isNullOrEmpty, isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { displayNotification } from '../../utils/PNotification/PNotification'
import { getAxiosInstance } from '../../utils/axiosInstanceInit'
import { getFileRejectionMessage } from './PUploadUtils'
import type { PUploadCoreOptions, RejectedFileEntry, RemoteDeleteOutcome } from './PUploadTypes'

// Shared internals of PUpload and PUploadMultiple: native `accept` patching,
// client-side rejection state (extension/size) and the exceeded-limit toast.
export function useUploadCore(options: PUploadCoreOptions) {
  // `accept` is set on the native input (file picker pre-filtering) rather than
  // passed to ElUpload's `accept` prop, which would also make the dragger silently
  // drop non-matching files — we want them to reach validation and show an error.
  // The upload element is part of the watch sources: it remounts when the drop
  // zone reappears after being hidden, and the patch must be re-applied.
  watch([options.uploadElement, options.accept], () => {
    const acceptValue = options.accept.value
    if (options.uploadElement.value === null || isNullOrEmpty(acceptValue)) {
      return
    }
    const nativeInputElement = (options.uploadElement.value.$el as HTMLElement).querySelector('input.el-upload__input')
    nativeInputElement?.setAttribute('accept', acceptValue)
  })

  const rejectedEntries = ref<RejectedFileEntry[]>([])

  // Validates a file against `accept` and the size limit. Rejected files are
  // recorded as error lines; they never reach the model.
  const tryAcceptFile = (uploadFile: UploadFile): boolean => {
    const rejectionMessage = getFileRejectionMessage(uploadFile, {
      accept: options.accept.value,
      maxFileSizeInMo: options.maxFileSizeInMo.value,
      rejectedFileMessage: options.rejectedFileMessage.value,
    })
    if (rejectionMessage === undefined) {
      return true
    }
    rejectedEntries.value = [
      ...rejectedEntries.value,
      { uid: uploadFile.uid, fileName: uploadFile.name, message: rejectionMessage },
    ]
    return false
  }

  const dismissRejectedEntry = (uid: number) => {
    rejectedEntries.value = rejectedEntries.value.filter((entry) => entry.uid !== uid)
  }

  const notifyMaxFilesExceeded = () => {
    displayNotification('error', options.maxFilesExceededMessage.value)
  }

  const isRemoteDeleteEnabled = computed(() =>
    options.canRemoteDelete.value === true
    && isNotNullNorEmpty(options.remoteDeleteUrl.value),
  )

  const deletingUploadedFileIds = ref<Set<string | number>>(new Set())

  // A successfully deleted file keeps its deleting state until the parent
  // removes it from the displayed persisted documents (refetch or filtering),
  // so the line never flashes back to its success look.
  watch(options.uploadedFileIds, (currentIds) => {
    const remainingIds = [...deletingUploadedFileIds.value].filter((id) => currentIds.includes(id))
    if (remainingIds.length !== deletingUploadedFileIds.value.size) {
      deletingUploadedFileIds.value = new Set(remainingIds)
    }
  })

  const deleteUploadedFileRemotely = async (fileId: string | number): Promise<RemoteDeleteOutcome> => {
    const axiosInstance = getAxiosInstance()
    const baseUrl = options.remoteDeleteUrl.value
    if (axiosInstance === undefined || isNullOrEmpty(baseUrl)) {
      logger.error('Remote deletion requested but no axios instance was provided to the styleguide plugin')
      return 'unavailable'
    }
    deletingUploadedFileIds.value = new Set([...deletingUploadedFileIds.value, fileId])
    try {
      await axiosInstance.delete(`${baseUrl.replace(/\/+$/, '')}/${fileId}`)
      return 'deleted'
    } catch (error) {
      logger.error('Error deleting uploaded file remotely', error)
      displayNotification('error', options.remoteDeleteErrorMessage.value)
      deletingUploadedFileIds.value = new Set(
        [...deletingUploadedFileIds.value].filter((id) => id !== fileId),
      )
      return 'failed'
    }
  }

  return {
    rejectedEntries,
    tryAcceptFile,
    dismissRejectedEntry,
    notifyMaxFilesExceeded,
    isRemoteDeleteEnabled,
    deletingUploadedFileIds,
    deleteUploadedFileRemotely,
  }
}
