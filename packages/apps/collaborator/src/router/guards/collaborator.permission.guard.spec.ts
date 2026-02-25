import { CurrentUserManagerMock, hasPermissionMock } from '@pulse/common/mocks/vitest'
import { collaboratorPermissionGuard } from './collaborator.permission.guard'
import { PERMISSIONS_META } from '@pulse/common/constants'
import { createTestingPinia } from '@pinia/testing'

createTestingPinia()

vi.mock('@pulse/toolbox')

vi.mock('@collaborator/managers/collaborator.authenticated.flow.manager', () => ({
  CollaboratorAuthenticatedFlowManager: {
    getCollaboratorLandingPage: () => ({ name: 'home' }),
  },
}))

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
}))

describe('collaboratorPermissionGuard', () => {
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
          [PERMISSIONS_META]: 'admin',
        },
      },
      hasPermission: true,
    },
    {
      to: {
        name: 'collab',
        meta: {
          [PERMISSIONS_META]: 'collab',
        },
      },
      target: {
        name: 'home',
      },
      hasPermission: false,
    },
  ])('should react depend on the permissions',
    async ({ to, target, hasPermission }) => {
      hasPermissionMock.mockReturnValue(hasPermission)

      const result = await collaboratorPermissionGuard(to as any)

      if (target !== undefined) {
        expect(result).toEqual(target)
      } else {
        expect(result).toBeUndefined()
      }
    })
})
