import { getMockedEntitySummary, getPermissionsMock, getInvoicesAccessResponseMock, LocalStorageMock } from '../../__mocks__'
import { getStoreMock, permissionServiceMock, fetchUserAccountPermissionsMock } from '@pulse/common/mocks/vitest'
import { useCurrentEntityStore } from '../../stores/current-entity/current-entity.store'
import { usePermissionsStore } from '../../stores/permissions/permissions.store'
import { useInvoicesAccessStore } from '../../stores/invoices-access/invoices-access.store'
import { InvoicesAccessService } from '../../services/invoices-access/invoices-access.service'
import { CurrentEntityManager } from './current-entity.manager'
const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
const permissionsStoreMock = getStoreMock(usePermissionsStore)
const invoicesAccessStoreMock = getStoreMock(useInvoicesAccessStore)

vi.mock('../../services/permissions/permissions.service', () => permissionServiceMock)
vi.mock('../../services/invoices-access/invoices-access.service')

describe('test current-entity.manager', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: new LocalStorageMock(),
      configurable: true,
    })
  })
  describe('CurrentEntityManager', () => {
    it('should set currentEntity properly', async () => {
      const permissionsMock = getPermissionsMock()
      const accessMock = getInvoicesAccessResponseMock()

      const setItemMock = vi.spyOn(Object.getPrototypeOf(localStorage), 'setItem')
      const entityMock = getMockedEntitySummary()
      const { accountId: expectedAccountId } = entityMock

      fetchUserAccountPermissionsMock.mockResolvedValueOnce(permissionsMock)
      vi.mocked(InvoicesAccessService.fetchInvoicesAccess).mockResolvedValueOnce(accessMock)

      const expectedSetItemArguments = [
        'last-visited-entity',
        JSON.stringify(expectedAccountId),
      ]
      await CurrentEntityManager.initializeCurrentEntity(entityMock)

      expect(currentEntityStoreMock.setCurrentEntity).toHaveBeenCalledExactlyOnceWith(entityMock)

      expect(setItemMock).toHaveBeenCalledWith(...expectedSetItemArguments)

      expect(fetchUserAccountPermissionsMock).toHaveBeenCalledExactlyOnceWith(expectedAccountId)

      expect(permissionsStoreMock.setCurrentEntityPermissions).toHaveBeenCalledExactlyOnceWith(permissionsMock)

      expect(vi.mocked(InvoicesAccessService.fetchInvoicesAccess)).toHaveBeenCalledExactlyOnceWith(entityMock.accountId)
      expect(invoicesAccessStoreMock.setAccessData).toHaveBeenCalledExactlyOnceWith(accessMock)
    })

    it('should set access data to null when fetchInvoicesAccess fails', async () => {
      const permissionsMock = getPermissionsMock()
      const entityMock = getMockedEntitySummary()

      fetchUserAccountPermissionsMock.mockResolvedValueOnce(permissionsMock)
      vi.mocked(InvoicesAccessService.fetchInvoicesAccess).mockRejectedValueOnce(new Error('API error'))

      await CurrentEntityManager.initializeCurrentEntity(entityMock)

      expect(invoicesAccessStoreMock.setAccessData).toHaveBeenCalledExactlyOnceWith(null)
    })
  })

  describe('clearCurrentEntity', () => {
    it('should reset all stores and clear local storage', () => {
      const removeItemMock = vi.spyOn(Object.getPrototypeOf(localStorage), 'removeItem')

      CurrentEntityManager.clearCurrentEntity()

      expect(currentEntityStoreMock.setCurrentEntity).toHaveBeenCalledOnce()
      expect(permissionsStoreMock.setCurrentEntityPermissions).toHaveBeenCalledExactlyOnceWith([])
      expect(invoicesAccessStoreMock.reset).toHaveBeenCalledOnce()
      expect(removeItemMock).toHaveBeenCalledWith('last-visited-entity')
    })
  })
})
