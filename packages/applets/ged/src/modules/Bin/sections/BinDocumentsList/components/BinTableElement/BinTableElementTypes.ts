import type { BinDocument, DocumentsTableStructure } from '@/models/Document'

export interface BinTableElementProps {
  fieldType: DocumentsTableStructure['fieldType']
  data: BinDocument
}
