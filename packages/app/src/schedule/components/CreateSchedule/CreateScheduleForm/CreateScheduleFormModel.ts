import type { Account } from '@app/schedule/models/Account'
import type { AttachmentUpload } from '@app/schedule/models/Deadline'

export type Frequency = 'None' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly'

export interface Template {
  typeShort: string
  typeLong?: string
}

export interface Scheduling {
  date: string
  time: string
  frequency: Frequency
}

export interface Schedule {
  template: Template
  targets: Array<Account['id']>
  scheduling: Scheduling
  description?: string
  isDraft?: boolean
  isPrivate?: boolean
  reminders: number[]
  attachment: AttachmentUpload | null
}
