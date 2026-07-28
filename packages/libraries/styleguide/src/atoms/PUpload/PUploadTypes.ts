import type { Ref } from 'vue'
import type { UploadInstance } from 'element-plus'

// A document already persisted server-side, displayed by the upload components
// but never part of their v-model (the model only holds the pending selection).
export interface PUploadedFile {
  id: string | number
  fileName: string
}

// Internal state of a file refused client-side (extension or size), displayed
// as an error line until the user dismisses it. Exported for specs.
export interface RejectedFileEntry {
  uid: number
  fileName: string
  message: string
}

export interface PUploadCommonProps {
  pLabel?: string
  pAccept?: string
  pMaxFileSize?: number
  pRejectedFileMessage?: string
  pMaxFilesExceededMessage?: string
  pDisabled?: boolean
  pDeleteButtonTitle?: string
  pPrefixLabelFileLine?: string
  pSuffixLabelFileLine?: string
  pAuthorizedFileFormat?: string
  pTextLimitSize?: string
  pTestId?: string
  // Remote deletion of persisted documents: when enabled AND pRemoteDeleteUrl is
  // set, the component itself calls DELETE `${pRemoteDeleteUrl}/${file.id}` via
  // the app-provided axios instance, then emits `uploaded-file-deleted`.
  // Otherwise the deletion request is delegated via the `delete-uploaded-file` emit.
  pCanRemoteDelete?: boolean
  pRemoteDeleteUrl?: string
  pRemoteDeleteErrorMessage?: string
  // Confirmation popup shown before a remote deletion (remote path only: the
  // delegated `delete-uploaded-file` path keeps the consumer's own confirmation).
  pDeleteConfirmationTitle?: string
  pDeleteConfirmationMessage?: string
  pDeleteConfirmationConfirmLabel?: string
  pDeleteConfirmationCancelLabel?: string
}

// Result of a remote deletion attempt: 'unavailable' means the remote path
// could not run (no axios instance provided) and the caller should fall back
// to the `delete-uploaded-file` emit.
export type RemoteDeleteOutcome = 'deleted' | 'failed' | 'unavailable'

export interface PUploadProps extends PUploadCommonProps {
  pUploadedFile?: PUploadedFile
  pCanDeleteUploadedFile?: boolean
}

export interface PUploadCoreOptions {
  uploadElement: Ref<UploadInstance | null>
  accept: Ref<string | undefined>
  maxFileSizeInMo: Ref<number | undefined>
  rejectedFileMessage: Ref<string>
  maxFilesExceededMessage: Ref<string>
  canRemoteDelete: Ref<boolean>
  remoteDeleteUrl: Ref<string | undefined>
  remoteDeleteErrorMessage: Ref<string>
  // Ids of the currently displayed persisted documents: used to release the
  // per-file deleting state once the parent removes a deleted file.
  uploadedFileIds: Ref<(string | number)[]>
}

export interface FileRejectionOptions {
  accept: string | undefined
  maxFileSizeInMo: number | undefined
  rejectedFileMessage: string | undefined
}
