import { type DrawerProps } from 'element-plus'

export interface PDocumentViewerProps extends DrawerProps {
  titleDocument: string
  activeDocument: string | number
  totalDocuments: string | number
  hasIcon?: boolean
  hasPagination?: boolean
  showCloseButton?: boolean
  showPreviousDocument?: boolean
  showNextDocument?: boolean
}
