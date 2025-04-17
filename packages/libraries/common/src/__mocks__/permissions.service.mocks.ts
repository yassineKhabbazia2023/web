export const fetchUserPermissionsMock = vi.fn()
export const fetchUserAccountPermissionsMock = vi.fn()

export const permissionServiceMock = {
  fetchUserPermissions: fetchUserPermissionsMock,
  fetchUserAccountPermissions: fetchUserAccountPermissionsMock,
}
