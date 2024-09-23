import type { Service } from '@ged/models/Service'
import type { Document } from '@ged/models/Document'

export interface DownloadDocumentsComposableProps {
  selectedDocuments: Document[]
  currentService: Service['ServiceId']
  selectedEntity: string
}
