import type { Mock } from 'vitest'
import type { Permission } from '@pulse/common/types'

export const setCurrentUserMock: Mock = vi.fn()
export const initializeCurrentUserMock: Mock = vi.fn()
export const logoutMock: Mock = vi.fn()
export const hasPermissionMock: Mock = vi.fn((_: Permission[]) => true)
export const initTokenMock: Mock = vi.fn()
export const persistTokenMock: Mock = vi.fn()

export const CurrentUserManagerMock = {
  setCurrentUser: setCurrentUserMock,
  initializeCurrentUser: initializeCurrentUserMock,
  logout: logoutMock,
  hasPermission: hasPermissionMock,
  initToken: initTokenMock,
  persistToken: persistTokenMock,
}
