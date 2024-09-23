import type { DeadlinesByDate } from '@app/schedule/models/Deadline'

export interface ListItemProps {
  deadlinesByDate: DeadlinesByDate
  isActiveDate: boolean
}
