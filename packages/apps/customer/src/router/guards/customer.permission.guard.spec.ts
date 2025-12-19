import { CurrentUserManagerMock, hasPermissionMock } from '@pulse/common/mocks'
import { customerPermissionGuard } from './customer.permission.guard'
import { PERMISSIONS_META } from '@pulse/common/constants'
import { createTestingPinia } from '@pinia/testing'

createTestingPinia()

vi.mock('@pulse/toolbox')

vi.mock('@customer/managers/customer.authenticated.flow.manager', () => ({
  CustomerAuthenticatedFlowManager: {
    getLandingPage: () => ({ name: 'home' }),
  },
}))

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
}))

describe('customerPermissionGuard', () => {
  it.each([
    {
      to: {
        name: 'dashboard',
        meta: {},
      },
      hasPermission: true,
    },
    {
      to: {
        name: 'settings',
        meta: {
          [PERMISSIONS_META]: 'settings_access',
        },
      },
      hasPermission: true,
    },
    {
      to: {
        name: 'admin',
        meta: {
          [PERMISSIONS_META]: 'admin_access',
        },
      },
      target: {
        name: 'home',
      },
      hasPermission: false,
    },
  ])('should react depend on the permissions',
    async ({ to, target, hasPermission }) => {
      const next = vi.fn()

      hasPermissionMock.mockReturnValue(hasPermission)

      await customerPermissionGuard(to as any, {} as any, next)
      const expectedCall = target !== undefined ? [target] : []
      expect(next).toHaveBeenCalledWith(...expectedCall)
    })
})
