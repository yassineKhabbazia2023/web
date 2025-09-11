import { describe, it, expect, vi } from 'vitest'
import { getMockedEntitySummary } from '../../__mocks__/entity-summary.mock'
import { permissionServiceMock, fetchUserAccountPermissionsMock } from '../../__mocks__/permissions.service.mocks'

import { SelectedEntityManager } from './selected-entity.manager'
import { getStoreMock, getPermissionsMock } from '@common/__mocks__'
import { useSelectedEntityStore } from '../../stores/selected-entity/selected-entity.store'
import { usePermissionsStore } from '../../stores/permissions/permissions.store'

const selectedEntityStoreMock = getStoreMock(useSelectedEntityStore)
const permissionsStoreMock = getStoreMock(usePermissionsStore)

vi.mock('../../services/permissions/permissions.service', () => permissionServiceMock)

describe('test selected-entity.manager', () => {
  describe('SelectedEntityManager', () => {
    it('should set selectedEntity properly', async () => {
      const permissionsMock = getPermissionsMock()

      const setItemMock = vi.spyOn(Object.getPrototypeOf(localStorage), 'setItem')
      const entityMock = getMockedEntitySummary()
      const { accountId: expectedAccountId } = entityMock

      fetchUserAccountPermissionsMock.mockResolvedValueOnce(permissionsMock)

      const expectedSetItemArguments = [
        'selected-entity',
        JSON.stringify(expectedAccountId),
      ]
      await SelectedEntityManager.initializeSelectedEntity(entityMock)

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
