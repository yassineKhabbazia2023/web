import { Service } from '@/models/Service'
import { Document } from '@/models/Document'

export interface DownloadDocumentsComposableProps {
  selectedDocuments: Document[]
  currentService: Service['ServiceId']
  selectedEntity: string
}
