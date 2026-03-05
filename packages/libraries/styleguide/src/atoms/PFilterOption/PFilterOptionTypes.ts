import { IconName } from '@styleguide/types'

export interface PFilterOptionProps {
  pValue?: string | number
  pContent: string
  pColor:
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
  pSelected?: boolean
  pDisabled?: boolean
  pIconName: IconName
}
