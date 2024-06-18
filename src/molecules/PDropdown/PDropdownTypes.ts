import type { POptionProps } from '../../atoms/POption/POptionTypes'
import type { PSelectProps } from '../../molecules/PSelect/PSelectTypes'

export interface PDropdownOption extends POptionProps {
  pGroupLabel?: string
}

export interface PDropdownProps extends PSelectProps {
  pOptions: PDropdownOption[]
  pCheckAllLabel?: string
  pIsCheckAll?: boolean
}

export interface DropdownGroup {
  label: string
  options: PDropdownOption[]
}
