import { setActivePinia, createPinia } from 'pinia'
import { usePermissionsStore } from './permissions.store'
import { getPermissionsMock } from '@pulse/common/mocks'
import * as permissionService from '@pulse/common/services/permissions'

const permissionsMock = getPermissionsMock()
const entityPermissionsMock = ['PENNYLANE_VIEW']

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

  it('should set currentEntityPermissions properly when call setCurrentEntityPermissions()', () => {
    permissionsStore.setCurrentEntityPermissions(permissionsMock)

    expect(permissionsStore.currentEntityPermissions).toStrictEqual(permissionsMock)
  })

  it('updates userPermissions via service call', async () => {
    vi.mocked(permissionService.fetchUserPermissions).mockResolvedValue(permissionsMock)
    await permissionsStore.updateUserPermission()
    expect(permissionsStore.userPermissions).toEqual(permissionsMock)
    expect(permissionService.fetchUserPermissions).toHaveBeenCalled()
  })

  it('updates currentEntityPermissions via service call', async () => {
    vi.mocked(permissionService.fetchUserAccountPermissions).mockResolvedValue(entityPermissionsMock)
    await permissionsStore.updateCurrentEntityPermissions(123)
    expect(permissionsStore.currentEntityPermissions).toEqual(entityPermissionsMock)
    expect(permissionService.fetchUserAccountPermissions).toHaveBeenCalledWith(123)
  })

})
