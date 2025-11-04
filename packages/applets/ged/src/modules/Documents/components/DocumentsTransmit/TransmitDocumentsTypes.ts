import type { Service } from '@ged/models/Service'

export interface TransmitDocumentsComposableProps {
  selectedDocumentsIds: string[]
  currentService: Service['ServiceId']
  currentEntity: string
  accountId: number
}
