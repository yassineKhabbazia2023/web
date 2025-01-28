export interface PDocumentViewerProps {
  modelValue: boolean
  pSize?: string | number
  pDirection?: 'rtl' | 'ltr' | 'ttb' | 'btt' | 'rtl'
  pShowClose?: boolean
  pDestroyOnClose?: boolean
  pTitleDocument: string
  pActiveDocument: string | number
  pTotalDocuments: string | number
  pHasIcon?: boolean
  pHasPagination?: boolean
  pShowCloseButton?: boolean
  pShowPreviousDocument?: boolean
  pShowNextDocument?: boolean
}
