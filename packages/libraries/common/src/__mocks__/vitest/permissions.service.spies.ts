import type { Mock } from 'vitest'

export const fetchUserPermissionsMock: Mock = vi.fn()
export const fetchUserAccountPermissionsMock: Mock = vi.fn()

export const permissionServiceMock = {
  fetchUserPermissions: fetchUserPermissionsMock,
  fetchUserAccountPermissions: fetchUserAccountPermissionsMock,
}
