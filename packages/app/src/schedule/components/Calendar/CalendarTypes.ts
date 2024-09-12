import type { DeadlinesByDate } from '@/schedule/models/Deadline'

export interface CalendarProps {
  modelValue: Date
  deadlinesByDate: DeadlinesByDate[]
  pRange: [Date, Date]
}
