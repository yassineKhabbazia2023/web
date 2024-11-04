import type { Status } from '@app/schedule/models/Deadline'
import type { PTaskItemProps } from '@pulse/styleguide'

export const CALENDAR_STATUS_MAPPING: Record<Status, PTaskItemProps['pStatus']> = {
  Todo: 'todo',
  Draft: 'disabled',
  Done: 'done',
}
