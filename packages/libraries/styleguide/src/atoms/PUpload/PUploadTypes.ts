import type { PUploadFileLineProps } from '../../atoms/PUploadFileLine/PUploadFileLineTypes'

export interface UploadProps {
  pAction?: string
  pMultiple?: boolean
  pDrag?: boolean
  pDisabled?: boolean
  pAccept?: string
  pShowFileList?: boolean
  pUploadType?: 'slot' | 'file-line' | 'dragger'
  pTextLimitSize?: string
  pPrefixLabelFileLine?: string
  pSuffixLabelFileLine?: string
  pShouldClearPreviousFilesListOnUpload?: boolean
  pAuthorizedFileFormat?: string
  pColorFileLine?: PUploadFileLineProps['pColor']
}
