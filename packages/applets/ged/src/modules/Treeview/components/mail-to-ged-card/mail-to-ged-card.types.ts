import type { Service } from '@ged/models/Service'

export interface MailToGedProps {
  selectedEntity: string
  accountId: number
  entityServices: Service[]
}
