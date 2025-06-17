import { mockedPermissionCodes } from './permissions.mocks'

export const rightDrawerUtilsMocks = {
  getPermissionCodes: vi.fn(() => mockedPermissionCodes),
}
