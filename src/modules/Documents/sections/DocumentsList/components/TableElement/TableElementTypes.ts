import type { Document, DocumentsTableStructure } from '@/models/Document'

export interface TableElementPops {
  fieldType: DocumentsTableStructure['fieldType']
  fieldName: DocumentsTableStructure['columnName']
  data: Document
}

// At the moment we're unable to correctly import the tag types without importing
// it from sources files so we need to use any
export interface PiaStatusTag {
  icon: any
  type: any
}
