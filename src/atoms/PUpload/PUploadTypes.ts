export interface UploadProps {
  pAction?: string
  pMultiple?: boolean
  pDrag?: boolean
  pDisabled?: boolean
  pAccept?: string
  pShowFileList?: boolean
  pUploadType?: 'slot' | 'file-line'
  pTextLimitSize?: string
  pPrefixLabelFileLine?: string
  pSuffixLabelFileLine?: string
}
