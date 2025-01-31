
import type { Service } from '@ged/models/Service'

export interface BinDocumentProps {
  currentBinService: Service['ServiceId']
  selectedEntity: string
  selectedServiceName: string
  accountId: number
}
