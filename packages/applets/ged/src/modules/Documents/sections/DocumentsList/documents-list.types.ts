import type { Document, DocumentsWithTableStructure } from '@ged/models/Document'
import type { Service } from '@ged/models/Service'

export interface DocumentsListProps {
  documentsListWithTableStructure: DocumentsWithTableStructure
  isInSearchScope?: boolean
  currentService: Service['ServiceId']
}

export interface GetRowClassNameParameters {
  document: Document
  draggedDocuments: Document[]
  isDragging: boolean
}

export interface DocumentListTableColumn {
  label: string
}
