import { IconName } from '@styleguide/types'

export interface PFilterOptionProps {
  pValue?: string | number
  pContent: string
  pColor: 'success' | 'warning' | 'tranquil' | 'danger' | 'disabled' | 'light-gray' | 'gray' | 'light-blue'
  pSelected?: boolean
  pDisabled?: boolean
  pIconName: IconName
}
