import type { Document } from '@/models/Document'
import type { Service } from '@/models/Service'

export interface DocumentRenameProps {
  modelValue: boolean
  selectedEntity: string
  currentService: Service['ServiceId']
  document: Document
}
