import type { FormattedPennylaneDocument } from '@pennylane/types/pennylane-documents.type'

export interface PennylaneDocumentsTableProps {
  pennylaneDocuments: FormattedPennylaneDocument[]
  accountNumber: string
  accountId: number
}

export type PennylaneDocumentsTableFieldKeys =
'name' |
'path' |
'updatedAt' |
'actions'

export type PennylaneDocumentsTableActionName =
  'download'
