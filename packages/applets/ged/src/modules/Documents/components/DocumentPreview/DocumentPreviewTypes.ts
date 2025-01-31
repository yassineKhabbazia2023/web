import type { Document } from '@ged/models/Document'
import type { Service } from '@ged/models/Service'
export interface DocumentsPreviewProps {
  openDrawer: boolean
  document: Document
  serviceId: Service['ServiceId']
  entityId: string
  accountId: number
  selectedDocumentIndex: number
  totalDocumentsCount: number
}
