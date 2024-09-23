import type { DeadlinesByDate } from '@app/schedule/models/Deadline'

export interface DeadlineListProps {
  deadlinesByDate: DeadlinesByDate[] | undefined
  activeDate: Date
  isSearchState: boolean
}
