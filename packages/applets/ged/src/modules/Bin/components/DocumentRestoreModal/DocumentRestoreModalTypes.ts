import type { Service } from '@ged/models/Service'
import type { BinDocument } from '@ged/models/Document'

export interface DocumentRestoreModalTypesProps {
  isVisible: boolean
  document: BinDocument | null
  serviceId: Service['ServiceId']
  entityId: string
  accountId: number
}
