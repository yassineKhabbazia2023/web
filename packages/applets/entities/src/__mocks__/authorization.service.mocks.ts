import { mockFetchAuthorizationsConfig, mockUpdateAccountPermission, mockUpdateUserPermission } from './permissions.mocks'

export const authorizationServiceMock = {
  fetchAuthorizationsConfig: mockFetchAuthorizationsConfig,
  updateUserPermissions: mockUpdateUserPermission,
  fetchAccountAuthorizationsConfig: mockFetchAuthorizationsConfig,
  updateAccountPermissions: mockUpdateAccountPermission,
}
