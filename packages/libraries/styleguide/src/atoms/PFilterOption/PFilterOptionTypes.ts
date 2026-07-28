import type { IconName } from '@styleguide/types'

export type PFilterOptionColor =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'light-green'
  | 'light-blue'
  | 'blue'
  | 'tranquil'
  | 'purple'
  | 'disabled'
  | 'light-gray'
  | 'gray'

export interface PFilterOptionProps {
  pValue?: string | number
  pContent: string
  pColor: PFilterOptionColor
  pSelected?: boolean
  pDisabled?: boolean
  pIconName?: IconName
}
