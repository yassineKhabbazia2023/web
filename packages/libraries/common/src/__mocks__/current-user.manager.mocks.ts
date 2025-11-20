import type { Mock } from 'vitest'
import { arrayIncludes } from '@pulse/toolbox/utils/array'
import type { Permission } from '../types/permission.type'

export const setCurrentUserMock: Mock = vi.fn()
export const initializeCurrentUserMock: Mock = vi.fn()
export const logoutMock: Mock = vi.fn()
export const hasPermissionMock: Mock = vi.fn((_: Permission[]) => true)
export const initTokenMock: Mock = vi.fn()
export const persistTokenMock: Mock = vi.fn()

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
