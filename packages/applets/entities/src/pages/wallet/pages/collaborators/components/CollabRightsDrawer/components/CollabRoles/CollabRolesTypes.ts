import type { Role } from '../../CollabRightsDrawerTypes'

export interface CollabRolesProps {
  roles: Role[]
  currentRole: string
  selectedRoleId: number
  preSelectedRoleId: number | undefined
}
