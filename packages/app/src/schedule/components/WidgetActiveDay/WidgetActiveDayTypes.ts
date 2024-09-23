import type { Deadline } from '@app/schedule/models/Deadline'

export interface WidgetActiveDayProps {
  activeDate: Date
  deadlines: Deadline[]
}
