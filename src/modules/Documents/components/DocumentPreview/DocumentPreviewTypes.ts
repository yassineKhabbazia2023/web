import type { Document } from '@/models/Document'
import type { Service } from '@/models/Service'
export interface DocumentsPreviewProps {
  openDrawer: boolean
  document: Document
  serviceId: Service['ServiceId']
  entityId: string
  selectedDocumentIndex: number
  totalDocumentsCount: number
}
