import { describe, it, expect, vi } from 'vitest'
import { getMockedEntitySummary } from '../../__mocks__/entity-summary.mock'
import { permissionServiceMock, fetchUserAccountPermissionsMock } from '../../__mocks__/permissions.service.mocks'

import { CurrentEntityManager } from './current-entity.manager'
import { getStoreMock, getPermissionsMock } from '@common/__mocks__'
import { useCurrentEntityStore } from '../../stores/current-entity/current-entity.store'
import { usePermissionsStore } from '../../stores/permissions/permissions.store'

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
const permissionsStoreMock = getStoreMock(usePermissionsStore)

vi.mock('../../services/permissions/permissions.service', () => permissionServiceMock)

describe('test current-entity.manager', () => {
  describe('CurrentEntityManager', () => {
    it('should set currentEntity properly', async () => {
      const permissionsMock = getPermissionsMock()

      const setItemMock = vi.spyOn(Object.getPrototypeOf(localStorage), 'setItem')
      const entityMock = getMockedEntitySummary()
      const { accountId: expectedAccountId } = entityMock

      fetchUserAccountPermissionsMock.mockResolvedValueOnce(permissionsMock)

      const expectedSetItemArguments = [
        'last-visited-entity',
        JSON.stringify(expectedAccountId),
      ]
      await CurrentEntityManager.initializeCurrentEntity(entityMock)

      expect(currentEntityStoreMock.setCurrentEntity).toHaveBeenCalledOnce()
      expect(currentEntityStoreMock.setCurrentEntity).toHaveBeenCalledWith(entityMock)

      expect(setItemMock).toHaveBeenCalledWith(...expectedSetItemArguments)

      expect(fetchUserAccountPermissionsMock).toHaveBeenCalledExactlyOnceWith(expectedAccountId)

      expect(currentEntityStoreMock.setCurrentEntity).toHaveBeenCalledOnce()
      expect(currentEntityStoreMock.setCurrentEntity).toHaveBeenCalledWith(entityMock)

      expect(permissionsStoreMock.setCurrentEntityPermissions).toHaveBeenCalledExactlyOnceWith(permissionsMock)
    })
  })
})
