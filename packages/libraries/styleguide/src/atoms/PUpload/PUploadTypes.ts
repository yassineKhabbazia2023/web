import type { UploadFile } from 'element-plus'
import type { PUploadFileLineProps } from '../../atoms/PUploadFileLine/PUploadFileLineTypes'
import type { PUploadType } from './PUpload.enums'

export interface UploadProps {
  pAction?: string
  pMultiple?: boolean
  pDrag?: boolean
  pDisabled?: boolean
  pAccept?: string
  pShowFileList?: boolean
  pUploadType?: PUploadType
  pTextLimitSize?: string
  pPrefixLabelFileLine?: string
  pSuffixLabelFileLine?: string
  pShouldClearPreviousFilesListOnUpload?: boolean
  pAuthorizedFileFormat?: string
  pColorFileLine?: PUploadFileLineProps['pColor']
  pDeleteButtonTitle?: string
  pRejectedFileMessage?: string
  pMaxFileSize?: number
  pShowDeleteButton?: boolean
  pLabel?: string
  pInitialFiles?: UploadFile[]
  pTestId?: string
}

export interface FileRejectionOptions {
  accept: string | undefined
  maxFileSizeInMo: number | undefined
  rejectedFileMessage: string | undefined
}
