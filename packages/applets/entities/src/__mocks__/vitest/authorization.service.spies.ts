import {
  fetchAccountAuthorizationsConfig,
  fetchAuthorizationsConfig,
  updateAccountPermissions,
  updateUserPermissions,
} from '@entities/services/authorization'
import { mockedAuthorizationsConfig } from '../permissions.mocks'

// The authorization service is spy-wrapped project-wide (vitest.setup.ts):
// these legacy names alias the shared spies so specs keep their assertions.
// Consumer specs arm the legacy default behaviors per test with
// armAuthorizationServiceMocks() (the guards re-arm the real implementations
// before every test).
export const updateUserPermissionsMock = vi.mocked(updateUserPermissions)
export const updateAccountPermissionsMock = vi.mocked(updateAccountPermissions)
export const fetchAuthorizationsConfigMock = vi.mocked(fetchAuthorizationsConfig)

const fetchAccountAuthorizationsConfigMock = vi.mocked(fetchAccountAuthorizationsConfig)

export function armAuthorizationServiceMocks(): void {
  updateUserPermissionsMock.mockImplementation(() => Promise.resolve())
  updateAccountPermissionsMock.mockImplementation(() => Promise.resolve())
  fetchAuthorizationsConfigMock.mockImplementation(() => Promise.resolve(mockedAuthorizationsConfig))
  fetchAccountAuthorizationsConfigMock.mockImplementation(() => Promise.resolve(mockedAuthorizationsConfig))
}
