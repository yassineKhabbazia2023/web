import { arrayIncludes } from '@pulse/toolbox/utils/array'
import type { Permission } from '../types/permission.type'

export const setCurrentUserMock = vi.fn()
export const initializeCurrentUserMock = vi.fn()
export const logoutMock = vi.fn()
export const hasPermissionMock = vi.fn((_: Permission[]) => true)
export const initTokenMock = vi.fn()
export const persistTokenMock = vi.fn()

export function getHasPermissionMocked(permissionCodes: Permission[]) {
  return (codes: Permission[]) => arrayIncludes(permissionCodes, codes)
}

export const CurrentUserManagerMock = {
  setCurrentUser: setCurrentUserMock,
  initializeCurrentUser: initializeCurrentUserMock,
  logout: logoutMock,
  hasPermission: hasPermissionMock,
  initToken: initTokenMock,
  persistToken: persistTokenMock,
}
