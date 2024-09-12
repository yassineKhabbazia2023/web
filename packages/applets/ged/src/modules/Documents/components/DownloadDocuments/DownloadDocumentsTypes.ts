import type { Service } from '@/models/Service'
import type { Document } from '@/models/Document'

export interface DownloadDocumentsComposableProps {
  selectedDocuments: Document[]
  currentService: Service['ServiceId']
  selectedEntity: string
}
