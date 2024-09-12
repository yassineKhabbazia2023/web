import type { DocumentsWithTableStructure } from '@/models/Document'
import type { Service } from '@/models/Service'

export interface DocumentsListProps {
  documentsListWithTableStructure: DocumentsWithTableStructure
  isInSearchScope?: boolean
  currentService: Service['ServiceId']
}
