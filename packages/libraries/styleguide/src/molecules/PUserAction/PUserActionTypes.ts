import type { PDropdownOption } from '../../molecules/PDropdown/PDropdownTypes'
import { AvatarRoles } from '../../utils/avatar.roles'

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
  pWarningContent?: string
  pAvatarRole?: AvatarRoles
}
