import type { PUploadCommonProps, PUploadedFile } from '../PUpload/PUploadTypes'

export interface PUploadMultipleProps extends PUploadCommonProps {
  pUploadedFiles?: PUploadedFile[]
  pCanDeleteUploadedFiles?: boolean
  // Total cap, persisted + pending files included. Undefined means unlimited.
  pMaxFiles?: number
  // Native file-dialog multi-selection. Dropping several files at once is
  // always possible regardless of this flag (capped by pMaxFiles).
  pMultiple?: boolean
}
