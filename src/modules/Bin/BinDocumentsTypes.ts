/* eslint-disable max-len */
import type { Service } from '@/models/Service'

export interface BinDocumentProps {
  currentBinService: Service['ServiceId']
  selectedEntity: string
  selectedServiceName: string
}
