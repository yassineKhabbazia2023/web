import { Document } from '@/models/Document'
import type { Service } from '@/models/Service'

export interface DocumentTabsProps {
  document: Document
  selectedEntity: string
  currentService: Service['ServiceId']
}
