import type { Permission } from '@pulse/common/types'

export interface Action {
  actionId: number
  code: Permission
  name: string
  label: string
  enabled: boolean
}

export interface AuthorizationConfig {
  category: string
  actions: Action[]
}
