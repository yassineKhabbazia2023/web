import type { Mock } from 'vitest'
import { mockedAuthorizationsConfig } from '../permissions.mocks'

export const mockUpdateUserPermission: Mock = vi.fn()
export const mockUpdateAccountPermission: Mock = vi.fn()
export const mockFetchAuthorizationsConfig: Mock = vi.fn(() => Promise.resolve(mockedAuthorizationsConfig))

export const authorizationServiceMock = {
  fetchAuthorizationsConfig: mockFetchAuthorizationsConfig,
  updateUserPermissions: mockUpdateUserPermission,
  fetchAccountAuthorizationsConfig: mockFetchAuthorizationsConfig,
  updateAccountPermissions: mockUpdateAccountPermission,
}
