import { mockedPermissionCodes } from './permissions.mock'

export const rightDrawerUtilsMocks = {
  getPermissionCodes: vi.fn(() => mockedPermissionCodes),
}