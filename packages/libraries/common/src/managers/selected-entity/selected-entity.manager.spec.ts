import { describe, it, expect, vi } from 'vitest'
import { getMockedEntity } from '../../__mocks__/entities.mocks'
import { permissionServiceMock, fetchUserAccountPermissionsMock } from '../../__mocks__/permissions.service.mocks'

import { SelectedEntityManager } from './selected-entity.manager'
import { getStoreMock } from '@common/__mocks__'
import { useSelectedEntityStore } from '../../stores/selected-entity/selected-entity.store'
import { usePermissionsStore } from '../../stores/permissions/permissions.store'

const selectedEntityStoreMock = getStoreMock(useSelectedEntityStore)
const permissionsStoreMock = getStoreMock(usePermissionsStore)

vi.mock('../../services/permissions/permissions.service', () => permissionServiceMock)

describe('test selected-entity.manager', () => {
  describe('SelectedEntityManager', () => {
    it('should set selectedEntity properly', async () => {
      const permissionsMock = ['abc']
      const setItemMock = vi.spyOn(Object.getPrototypeOf(localStorage), 'setItem')
      const entityMock = getMockedEntity()
      const { accountId: expectedAccountId } = entityMock

      fetchUserAccountPermissionsMock.mockResolvedValueOnce(permissionsMock)

      const expectedSetItemArguments = [
        'selected-entity',
        JSON.stringify(entityMock),
      ]
      await SelectedEntityManager.persistSelectedEntity(entityMock)

      expect(selectedEntityStoreMock.setSelectedEntity).toHaveBeenCalledOnce()
      expect(selectedEntityStoreMock.setSelectedEntity).toHaveBeenCalledWith(entityMock)

      expect(setItemMock).toHaveBeenCalledOnce()
      expect(setItemMock).toHaveBeenCalledWith(...expectedSetItemArguments)

      expect(fetchUserAccountPermissionsMock).toHaveBeenCalledOnce()
      expect(fetchUserAccountPermissionsMock).toHaveBeenCalledWith(expectedAccountId)

      expect(selectedEntityStoreMock.setSelectedEntity).toHaveBeenCalledOnce()
      expect(selectedEntityStoreMock.setSelectedEntity).toHaveBeenCalledWith(entityMock)

      expect(permissionsStoreMock.setSelectedEntityPermissions).toHaveBeenCalledOnce()
      expect(permissionsStoreMock.setSelectedEntityPermissions).toHaveBeenCalledWith(permissionsMock)
    })
  })
})
