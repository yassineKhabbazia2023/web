import { getMockedEntitySummary, getPermissionsMock, getInvoicesAccessResponseMock } from '../../__mocks__'
import { AccountType } from '../../enums/account-type.enum'
import {
  getStoreMock,
  setLastVisitedEntityIdMock,
  removeLastVisitedEntityIdMock,
} from '@pulse/common/mocks/vitest'
import { useCurrentEntityStore } from '../../stores/current-entity/current-entity.store'
import { usePermissionsStore } from '../../stores/permissions/permissions.store'
import { useInvoicesAccessStore } from '../../stores/invoices-access/invoices-access.store'
import { fetchUserAccountPermissions } from '../../services/permissions/permissions.service'
import { InvoicesAccessService } from '../../services/invoices-access/invoices-access.service'
import { CurrentEntityManager } from './current-entity.manager'
const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
const permissionsStoreMock = getStoreMock(usePermissionsStore)
const invoicesAccessStoreMock = getStoreMock(useInvoicesAccessStore)

describe('test current-entity.manager', () => {
  describe('CurrentEntityManager', () => {
    it('should set currentEntity properly without fetching invoices access by default', async () => {
      const permissionsMock = getPermissionsMock()
      const entityMock = getMockedEntitySummary()
      const { accountId: expectedAccountId } = entityMock
      const fetchInvoicesAccessSpy = vi.spyOn(InvoicesAccessService, 'fetchInvoicesAccess')

      vi.mocked(fetchUserAccountPermissions).mockResolvedValueOnce(permissionsMock)

      await CurrentEntityManager.initializeCurrentEntity(entityMock)

      expect(currentEntityStoreMock.setCurrentEntity).toHaveBeenCalledExactlyOnceWith(entityMock)

      expect(setLastVisitedEntityIdMock).toHaveBeenCalledWith(expectedAccountId)

      expect(fetchUserAccountPermissions).toHaveBeenCalledExactlyOnceWith(expectedAccountId)

      expect(permissionsStoreMock.setCurrentEntityPermissions).toHaveBeenCalledExactlyOnceWith(permissionsMock)

      expect(fetchInvoicesAccessSpy).not.toHaveBeenCalled()
      expect(invoicesAccessStoreMock.setAccessData).not.toHaveBeenCalled()
    })

    it('should fetch invoices access when the option is enabled', async () => {
      const permissionsMock = getPermissionsMock()
      const accessMock = getInvoicesAccessResponseMock()
      const entityMock = getMockedEntitySummary()

      vi.mocked(fetchUserAccountPermissions).mockResolvedValueOnce(permissionsMock)
      vi.spyOn(InvoicesAccessService, 'fetchInvoicesAccess').mockResolvedValueOnce(accessMock)

      await CurrentEntityManager.initializeCurrentEntity(entityMock, { shouldFetchInvoicesAccess: true })

      expect(InvoicesAccessService.fetchInvoicesAccess).toHaveBeenCalledExactlyOnceWith(entityMock.accountId)
      expect(invoicesAccessStoreMock.setAccessData).toHaveBeenCalledExactlyOnceWith(entityMock.accountId, accessMock)
    })

    it('should not fetch invoices access for a prospect entity', async () => {
      const permissionsMock = getPermissionsMock()
      const entityMock = getMockedEntitySummary({ accountType: AccountType.PROSPECT })
      const fetchInvoicesAccessSpy = vi.spyOn(InvoicesAccessService, 'fetchInvoicesAccess')

      vi.mocked(fetchUserAccountPermissions).mockResolvedValueOnce(permissionsMock)

      await CurrentEntityManager.initializeCurrentEntity(entityMock, { shouldFetchInvoicesAccess: true })

      expect(fetchInvoicesAccessSpy).not.toHaveBeenCalled()
      expect(invoicesAccessStoreMock.reset).toHaveBeenCalledOnce()
    })

    it('should not fetch invoices access when the option is disabled', async () => {
      const permissionsMock = getPermissionsMock()
      const entityMock = getMockedEntitySummary()
      const fetchInvoicesAccessSpy = vi.spyOn(InvoicesAccessService, 'fetchInvoicesAccess')

      vi.mocked(fetchUserAccountPermissions).mockResolvedValueOnce(permissionsMock)

      await CurrentEntityManager.initializeCurrentEntity(entityMock, { shouldFetchInvoicesAccess: false })

      expect(currentEntityStoreMock.setCurrentEntity).toHaveBeenCalledExactlyOnceWith(entityMock)
      expect(fetchInvoicesAccessSpy).not.toHaveBeenCalled()
      expect(invoicesAccessStoreMock.reset).not.toHaveBeenCalled()
    })

    it('should set access data to null when fetchInvoicesAccess fails', async () => {
      const permissionsMock = getPermissionsMock()
      const entityMock = getMockedEntitySummary()

      vi.mocked(fetchUserAccountPermissions).mockResolvedValueOnce(permissionsMock)
      vi.spyOn(InvoicesAccessService, 'fetchInvoicesAccess').mockRejectedValueOnce(new Error('API error'))

      await CurrentEntityManager.initializeCurrentEntity(entityMock, { shouldFetchInvoicesAccess: true })

      expect(invoicesAccessStoreMock.setAccessData).toHaveBeenCalledExactlyOnceWith(entityMock.accountId, null)
    })
  })

  describe('clearCurrentEntity', () => {
    it('should reset all stores and clear local storage', () => {
      CurrentEntityManager.clearCurrentEntity()

      expect(currentEntityStoreMock.setCurrentEntity).toHaveBeenCalledOnce()
      expect(permissionsStoreMock.setCurrentEntityPermissions).toHaveBeenCalledExactlyOnceWith([])
      expect(invoicesAccessStoreMock.reset).toHaveBeenCalledOnce()
      expect(removeLastVisitedEntityIdMock).toHaveBeenCalledOnce()
    })
  })
})
