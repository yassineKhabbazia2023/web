import type { Service } from '@/models/Service'
import type { BinDocument } from '@/models/Document'

export interface DocumentRestoreModalTypesProps {
  isVisible: boolean
  document: BinDocument | null
  serviceId: Service['ServiceId']
  entityId: string
}
