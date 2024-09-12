import type { Service } from '@/models/Service'

export interface TransmitDocumentsComposableProps {
  selectedDocumentsIds: string[]
  currentService: Service['ServiceId']
  selectedEntity: string
}
