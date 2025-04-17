import { setActivePinia, createPinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import { usePermissionsStore } from './permissions.store'

const permissionsMock = ['ab', 'c']

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
})
