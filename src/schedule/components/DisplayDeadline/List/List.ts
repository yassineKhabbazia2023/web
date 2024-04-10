import type { DeadlinesByDate } from '@/schedule/models/Deadline'

export interface ListProps {
  items: DeadlinesByDate[] | undefined
  activeDate: Date
}
