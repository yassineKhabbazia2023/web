import type { KeyLabel } from '@app/schedule/models/commonTypes'

export type DropdownScheduleProps = {
  placeholder?: string
  schedulesCollection: KeyLabel[]
  modelValue: string
}
