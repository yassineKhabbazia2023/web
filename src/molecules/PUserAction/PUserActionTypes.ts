import type { PDropdownOption } from '@/molecules/PDropdown/PDropdownTypes'

export type POptionsValue = undefined | string | number | string[] | number[]

export interface PUserActionProps {
  pProfile: string
  pTitle: string
  pDescription: string
  pTagContent?: string
  pRole?: string
  pShowInput?: boolean
  pInputValue?: string
  pInputPlaceholder?: string
  pShowDelete?: boolean
  pShowOptions?: boolean
  pOptionsPlaceholder?: string
  pOptions?: PDropdownOption[]
  pOptionsValue?: POptionsValue
}
