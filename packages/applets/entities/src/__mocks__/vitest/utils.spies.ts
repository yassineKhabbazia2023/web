import { getPermissionCodes } from '@entities/components/ManageRightsDrawer/utils'
import { mockedPermissionCodes } from '../permissions.mocks'

// The ManageRightsDrawer utils are spy-wrapped project-wide (vitest.setup.ts):
// this legacy name aliases the shared spy so specs keep their assertions.
// Consumer specs arm the legacy default behavior per test with
// armRightDrawerUtilsMocks().
const getPermissionCodesMock = vi.mocked(getPermissionCodes)

export function armRightDrawerUtilsMocks(): void {
  getPermissionCodesMock.mockImplementation(() => mockedPermissionCodes)
}
