import type { Deadline } from '@/schedule/models/Deadline'

export interface WidgetActiveDayProps {
  activeDate: Date
  deadlines: Deadline[]
}
