import type { FormattedPennylaneDocument } from '@pennylane/types/pennylane-documents.type'

export interface PennylaneDocumentsTableProps {
  pennylaneDocuments: FormattedPennylaneDocument[]
}

export type PennylaneDocumentsTableFieldKeys =
'name' |
'path' |
'updatedAt'
