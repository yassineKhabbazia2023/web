import type { BinDocument, DocumentsTableStructure } from '@ged/models/Document'

export interface BinTableElementProps {
  fieldType: DocumentsTableStructure['fieldType']
  data: BinDocument
}
