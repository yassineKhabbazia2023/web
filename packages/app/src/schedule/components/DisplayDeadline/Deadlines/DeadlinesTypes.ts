import type { Deadline } from '@app/schedule/models/Deadline'

export type DeadlineEvent = 'view-reminder-details'

export interface DeadlinesProps {
  deadlines: Deadline[]
}
