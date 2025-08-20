import { CurrentUserManagerMock, hasPermissionMock } from '@pulse/common/mocks'
import { permissionGuard } from './permission.guard'
import { PERMISSIONS_META } from '@pulse/common/constants'
import { createTestingPinia } from '@pinia/testing'
import { CollaboratorPermission, CustomerPermission } from '@pulse/common/enums'

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
          [PERMISSIONS_META]: [CustomerPermission.DROIT_SUPER_ADMIN_CLIENT],
        },
      },
      hasPermission: true,
    },
    {
      to: {
        name: 'settings',
        meta: {
          [PERMISSIONS_META]: [CollaboratorPermission.ACCEDER_ONGLET_COLLABORATEURS_ADMIN],
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

      await permissionGuard(to as any, {} as any, next)
      if (target !== undefined) {
        expect(next).toHaveBeenCalledWith(target)
      } else {
        expect(next).toHaveBeenCalledWith()
      }
    })
})
