import { arrayIncludes } from '@pulse/toolbox/utils/array'
import type { Permission } from '../types/permission.type'

export function getHasPermissionMocked(permissionCodes: Permission[]) {
  return (codes: Permission[]) => arrayIncludes(permissionCodes, codes)
}
