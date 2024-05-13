import type { Account } from './Account'

export type Status = 'Done' | 'Todo' | 'Draft'
export interface Template {
  typeShortCustomer: string
  typeShortCollaborator: string
  typeLong: string
  typeShort: string
}
export interface DeadlineAccount extends Account {
    status: Status
}
export interface Deadline {
  scheduleId: number
  occurrenceId: number
  time: string
  template: Template
  globalStatus: Status
  accountList: DeadlineAccount[]
}

export interface DeadlinesByDate {
  date: string
  deadlines: Deadline[]
}
