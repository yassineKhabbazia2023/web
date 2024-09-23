import type { Status } from '@app/schedule/models/Deadline'

export type ScheduleModelLabelType = 'short' | 'long' | 'both'

export type ScheduleApiQueryParams = {
  startDate: string // format YYYY-MM-DD
  endDate: string // format YYYY-MM-DD
  skip?: number
  limit?: number
  searchTerm?: string
  targets?: number[]
  templates?: string[]
  status?: Status[]
  mineOnly?: boolean
}
