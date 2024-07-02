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

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
}

interface Attachment {
  name: string
}

export interface AttachmentUpload extends Attachment {
  content: string
}

export interface AttachmentDownload extends Attachment {
  size: number
}

export interface Schedule {
  id: number
  description: string
  attachment?: AttachmentDownload | null
  frequency: string
  reminders: number[]
  createdBy?: User
}

export interface Occurrence {
  id: number
  occurrenceDate: string
  schedule: Schedule
  template: Template
  globalStatus: string
  accountList: DeadlineAccount[]
}
