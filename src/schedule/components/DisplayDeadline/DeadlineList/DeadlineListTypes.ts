import type { DeadlinesByDate } from '@/schedule/models/Deadline'

export interface DeadlineListProps {
  deadlinesByDate: DeadlinesByDate[] | undefined
  activeDate: Date
}
