import type { Role } from '@entities/types'

export interface CollabRolesProps {
  roles: Role[]
  currentRole: string
  selectedRoleId: number
  preSelectedRoleId: number | undefined
}
