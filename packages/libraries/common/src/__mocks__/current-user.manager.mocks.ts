// doctrine mock-barrel: arrayIncludes is a pure toolbox utility whose id is
// never mocked/hubbed, so there is no pending factory to deadlock on — a
// module-level value import is safe here (keeps the helper synchronous).
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { arrayIncludes } from '@pulse/toolbox/utils/array'
import type { Permission } from '../types/permission.type'

export function getHasPermissionMocked(permissionCodes: Permission[]) {
  return (codes: Permission[]) => arrayIncludes(permissionCodes, codes)
}
