import type { Service } from '@ged/models/Service'

export interface BinDocumentProps {
  currentBinService: Service['ServiceId']
  currentEntity: string
  selectedServiceName: string
  accountId: number
}
