import type { Document } from '@ged/models/Document'
import type { Service } from '@ged/models/Service'

export interface DocumentRenameProps {
  modelValue: boolean
  currentEntity: string
  accountId: number
  currentService: Service['ServiceId']
  document: Document
}
