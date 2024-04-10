import type { Account } from './Account'

export type Status = 'Done' | 'Todo' | 'Draft'

interface Template {
  typeShortCustomer: string
  typeShortCollaborator: string
  typeLong: string
}

export interface DeadlineAccounts extends Account {
    status: Status
}

export interface Deadline {
  id: number
  time: string
  template: Template
  globalStatus: Status
  accountList: DeadlineAccounts[]
}

export interface DeadlinesByDate {
  date: string
  deadlines: Deadline[]
}
