import { CurrentUserManagerMock } from '@pulse/common/mocks'
import { permissionGuard } from './permission.guard'
import { PERMISSIONS_META } from '@pulse/common/constants'
import { createTestingPinia } from '@pinia/testing'

createTestingPinia()

vi.mock('@pulse/core')

vi.mock('@app/managers/authenticated.flow.manager', () => ({
  AuthenticatedFlowManager: {
    getLandingPage: () => ({ name: 'home' }),
  },
}))

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
}))

describe('permissionGuard', () => {
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
          [PERMISSIONS_META]: ['read'],
        },
      },
      hasPermission: true,
    },
    {
      to: {
        name: 'settings',
        meta: {
          [PERMISSIONS_META]: ['admin'],
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

      CurrentUserManagerMock.hasPermission.mockImplementation((_: string | string[]) => hasPermission)

      await permissionGuard(to as any, {} as any, next)
      if (target !== undefined) {
        expect(next).toHaveBeenCalledWith(target)
      } else {
        expect(next).toHaveBeenCalledWith()
      }
    })
})
