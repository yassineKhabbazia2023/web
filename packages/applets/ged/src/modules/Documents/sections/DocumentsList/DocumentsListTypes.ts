import type { DocumentsWithTableStructure } from '@ged/models/Document'
import type { Service } from '@ged/models/Service'

export interface DocumentsListProps {
  documentsListWithTableStructure: DocumentsWithTableStructure
  isInSearchScope?: boolean
  currentService: Service['ServiceId']
}
