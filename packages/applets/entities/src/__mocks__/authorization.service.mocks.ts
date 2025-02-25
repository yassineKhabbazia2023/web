import { mockFetchAuthorizationsConfig, mockUpdateAccountPermission, mockUpdateUserPermission } from './permissions.mock'

export const authorizationServiceMock = {
  fetchAuthorizationsConfig: mockFetchAuthorizationsConfig,
  updateUserPermissions: mockUpdateUserPermission,
  fetchAccountAuthorizationsConfig: mockFetchAuthorizationsConfig,
  updateAccountPermissions: mockUpdateAccountPermission,
}