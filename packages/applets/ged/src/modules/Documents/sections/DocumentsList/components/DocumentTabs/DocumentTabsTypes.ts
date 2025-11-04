import type { Document } from '@ged/models/Document'
import type { Service } from '@ged/models/Service'

export interface DocumentTabsProps {
  document: Document
  currentEntity: string
  accountId: number
  currentService: Service['ServiceId']
}
