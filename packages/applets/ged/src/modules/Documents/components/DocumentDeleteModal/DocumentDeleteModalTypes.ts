import type { Service } from '@ged/models/Service'

export interface DocumentDeleteModalTypesProps {
  isVisible: boolean
  documentIds: string[]
  serviceId: Service['ServiceId'] | null
  entityId: string
  accountId: number
}
