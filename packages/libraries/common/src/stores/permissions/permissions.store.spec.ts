import { setActivePinia, createPinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import { usePermissionsStore } from './permissions.store'
import {
  customerEntityPermissionsWithPennylane,
  collaboratorEntityPermissionsWithPennylane,
  customerEntityPermissionsWithoutPennylane,
  collaboratorEntityPermissionsWithoutPennylane,
} from '@pulse/common/mocks'
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

  it.each([
    {
      entityPermissions: customerEntityPermissionsWithPennylane(),
      expectedValue: true,
    },
    {
      entityPermissions: collaboratorEntityPermissionsWithPennylane(),
      expectedValue: true,
    },
    {
      entityPermissions: customerEntityPermissionsWithoutPennylane(),
      expectedValue: false,
    },
    {
      entityPermissions: collaboratorEntityPermissionsWithoutPennylane(),
      expectedValue: false,
    },
  ])('should return true when selectedEntityPermissions contains a pennylane permission', ({ entityPermissions, expectedValue }) => {
    permissionsStore.setSelectedEntityPermissions(entityPermissions)
    expect(permissionsStore.getHasPennylanePermission()).toBe(expectedValue)

  })
})
