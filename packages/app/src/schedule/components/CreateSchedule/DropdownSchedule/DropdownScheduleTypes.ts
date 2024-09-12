import type { KeyLabel } from '@/schedule/models/commonTypes'

export type DropdownScheduleProps = {
  placeholder?: string
  schedulesCollection: KeyLabel[]
  modelValue: string
}
