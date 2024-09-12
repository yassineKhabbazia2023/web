import type { Document } from '@ged/models/Document'
import type { Service } from '@ged/models/Service'

export interface DocumentTabsProps {
  document: Document
  selectedEntity: string
  currentService: Service['ServiceId']
}
