import type { Service } from '@ged/models/Service'

export interface MailToGedProps {
  currentEntity: string
  accountId: number
  entityServices: Service[]
}
