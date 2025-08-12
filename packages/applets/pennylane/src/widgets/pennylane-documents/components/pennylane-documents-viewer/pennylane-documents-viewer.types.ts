import type { PennylaneDocument } from '@pulse/common/types'

export interface PennylaneDocumentsViewerProps {
  isOpened: boolean
  pennylaneDocument?: PennylaneDocument
  accountNumber: string
  accountId: number
}
