import type { DeadlinesByDate } from '@app/schedule/models/Deadline'

export interface CalendarProps {
  modelValue: Date
  deadlinesByDate: DeadlinesByDate[]
  pRange: [Date, Date]
}
