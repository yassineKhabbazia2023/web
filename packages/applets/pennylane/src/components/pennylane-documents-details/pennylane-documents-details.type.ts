import type { FormattedPennylaneDocument } from '@pennylane/types/pennylane-documents.type'

export interface PennylaneDocumentsDetailsProps {
  pennylaneDocument: FormattedPennylaneDocument
}

export type PennylaneDocumentsDetailsLabels = {
  name: string
  path: string
  createdAt: string
  updatedAt: string
}
