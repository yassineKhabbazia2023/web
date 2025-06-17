import { arrayIncludes } from '@pulse/core/utils/array'

export const setCurrentUserMock = vi.fn()
export const initializeCurrentUserMock = vi.fn()
export const logoutMock = vi.fn()
export const hasPermissionMock = vi.fn((_: string | string[]) => true)
export const initTokenMock = vi.fn()
export const persistTokenMock = vi.fn()

export function getHasPermissionMocked(permissionCodes: string[]) {
  return (code: string | string[]) => arrayIncludes(permissionCodes, code)
}

export const CurrentUserManagerMock = {
  setCurrentUser: setCurrentUserMock,
  initializeCurrentUser: initializeCurrentUserMock,
  logout: logoutMock,
  hasPermission: hasPermissionMock,
  initToken: initTokenMock,
  persistToken: persistTokenMock,
}
