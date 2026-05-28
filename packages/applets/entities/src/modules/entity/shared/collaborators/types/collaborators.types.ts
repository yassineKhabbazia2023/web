import { ROLE_BUSINESS_COLORS } from '../constants/collaborators.const'

export type RoleBusiness = keyof typeof ROLE_BUSINESS_COLORS

export interface RoleLabel {
  labelId: number
  code: string
  customerLabel: string
  collaboratorLabel: string
  business: RoleBusiness
  description: string
  isVisible: boolean
}

export interface RoleLabelGroups {
  main: RoleLabel[]
  others: RoleLabel[]
}
