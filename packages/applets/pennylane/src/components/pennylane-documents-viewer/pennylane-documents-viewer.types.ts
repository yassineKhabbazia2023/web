import type { FormattedPennylaneDocument } from '@pennylane/types/pennylane-documents.type'

export interface PennylaneDocumentsViewerProps {
  isOpened: boolean
  pennylaneDocument?: FormattedPennylaneDocument
  accountNumber: string
  accountId: number
}
