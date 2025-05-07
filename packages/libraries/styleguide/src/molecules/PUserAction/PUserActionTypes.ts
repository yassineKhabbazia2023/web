import type { PDropdownOption } from '../../molecules/PDropdown/PDropdownTypes'
import { AvatarRoles } from '../../utils/avatar.roles'

export type POptionsValue = undefined | string | number | string[] | number[]

export interface PUserActionProps<T = POptionsValue> {
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
  pOptionsNoDataText?: string
  pOptions?: PDropdownOption[]
  pOptionsMultiple?: boolean
  pOptionsDisabled?: boolean
  pOptionsValue?: T
  pWarningContent?: string
  pAvatarRole?: AvatarRoles
}
