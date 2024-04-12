import type { Account } from '@/schedule/models/Account'

type Frequency = 'None' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly'

interface Template {
  typeShort: string
  typeLong?: string
}

interface Scheduling {
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
}
