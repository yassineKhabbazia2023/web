import type { Service } from '@/models/Service'

export interface DocumentDeleteModalTypesProps {
  isVisible: boolean
  documentIds: string[]
  serviceId: Service['ServiceId'] | null
  entityId: string
}
