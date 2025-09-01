import type { FormattedPennylaneDocument } from '@pennylane/types/pennylane-documents.type'

export interface PennylaneDocumentsDetailsProps {
  pennylaneDocument: FormattedPennylaneDocument
}

export type PennylaneDocumentsDetailsLabels = {
  path: string
  createdAt: string
  updatedAt: string
}
