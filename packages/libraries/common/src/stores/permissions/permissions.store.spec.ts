import { setActivePinia, createPinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import { usePermissionsStore } from './permissions.store'
import * as permissionService from '@pulse/common/services/permissions'

const permissionsMock = ['ab', 'c']
const entityPermissionsMock = ['PENNYLANE_VIEW']

vi.mock('@pulse/common/services/permissions', () => ({
  fetchUserPermissions: vi.fn(),
  fetchUserAccountPermissions: vi.fn(),
}))

describe('test permissionsStore', () => {
  let permissionsStore: ReturnType<typeof usePermissionsStore>

  beforeEach(() => {
    setActivePinia(createPinia())

    permissionsStore = usePermissionsStore()
  })

  it('should set userPermissions properly when call setUserPermissions()', () => {
    permissionsStore.setUserPermissions(permissionsMock)

    expect(permissionsStore.userPermissions).toStrictEqual(permissionsMock)
  })

  it('should set selectedEntityPermissions properly when call setSelectedEntityPermissions()', () => {
    permissionsStore.setSelectedEntityPermissions(permissionsMock)

    expect(permissionsStore.selectedEntityPermissions).toStrictEqual(permissionsMock)
  })

  it('updates userPermissions via service call', async () => {
    (permissionService.fetchUserPermissions as any).mockResolvedValue(permissionsMock)
    await permissionsStore.updateUserPermission()
    expect(permissionsStore.userPermissions).toEqual(permissionsMock)
    expect(permissionService.fetchUserPermissions).toHaveBeenCalled()
  })

  it('updates selectedEntityPermissions via service call', async () => {
    (permissionService.fetchUserAccountPermissions as any).mockResolvedValue(entityPermissionsMock)
    await permissionsStore.updateSelectedEntityPermissions(123)
    expect(permissionsStore.selectedEntityPermissions).toEqual(entityPermissionsMock)
    expect(permissionService.fetchUserAccountPermissions).toHaveBeenCalledWith(123)
  })

})
