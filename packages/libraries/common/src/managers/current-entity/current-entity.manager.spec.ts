import { flushPromises } from '@vue/test-utils'
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
import { useKeyMomentsAccessStore } from '../../stores/key-moments-access/key-moments-access.store'
import { fetchUserAccountPermissions } from '../../services/permissions/permissions.service'
import { InvoicesAccessService } from '../../services/invoices-access/invoices-access.service'
import { KeyMomentsManager } from '../key-moments/key-moments.manager'
import { CurrentEntityManager } from './current-entity.manager'
const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
const permissionsStoreMock = getStoreMock(usePermissionsStore)
const invoicesAccessStoreMock = getStoreMock(useInvoicesAccessStore)
const keyMomentsAccessStoreMock = getStoreMock(useKeyMomentsAccessStore)

describe('test current-entity.manager', () => {
  beforeEach(() => {
    // doctrine: static-classes — managers are stubbed with vi.spyOn per test
    vi.spyOn(KeyMomentsManager, 'canShowKeyMoments').mockResolvedValue(false)
  })

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

  describe('fetchKeyMomentsAccess', () => {
    it('should tell the store what the dossier answers, once the previous answer is dropped', async () => {
      const entityMock = getMockedEntitySummary()
      currentEntityStoreMock.currentEntityId = entityMock.accountId
      vi.spyOn(KeyMomentsManager, 'canShowKeyMoments').mockResolvedValue(true)

      await CurrentEntityManager.fetchKeyMomentsAccess(entityMock)

      expect(keyMomentsAccessStoreMock.reset).toHaveBeenCalledOnce()
      expect(keyMomentsAccessStoreMock.setCanShowKeyMoments).toHaveBeenCalledExactlyOnceWith(true)
    })

    it('should drop a late answer once another dossier is in context', async () => {
      const entityMock = getMockedEntitySummary()
      currentEntityStoreMock.currentEntityId = entityMock.accountId + 1
      vi.spyOn(KeyMomentsManager, 'canShowKeyMoments').mockResolvedValue(true)

      await CurrentEntityManager.fetchKeyMomentsAccess(entityMock)

      expect(keyMomentsAccessStoreMock.reset).toHaveBeenCalledOnce()
      expect(keyMomentsAccessStoreMock.setCanShowKeyMoments).not.toHaveBeenCalled()
    })

    it('should reset the store for a prospect entity without asking the dossier', async () => {
      const entityMock = getMockedEntitySummary({ accountType: AccountType.PROSPECT })

      await CurrentEntityManager.fetchKeyMomentsAccess(entityMock)

      expect(KeyMomentsManager.canShowKeyMoments).not.toHaveBeenCalled()
      expect(keyMomentsAccessStoreMock.setCanShowKeyMoments).not.toHaveBeenCalled()
      expect(keyMomentsAccessStoreMock.reset).toHaveBeenCalledOnce()
    })

    it('should be triggered when the current entity is initialized', async () => {
      const entityMock = getMockedEntitySummary()
      currentEntityStoreMock.currentEntityId = entityMock.accountId
      vi.mocked(fetchUserAccountPermissions).mockResolvedValueOnce(getPermissionsMock())
      vi.spyOn(KeyMomentsManager, 'canShowKeyMoments').mockResolvedValue(true)

      await CurrentEntityManager.initializeCurrentEntity(entityMock)
      await flushPromises()

      expect(keyMomentsAccessStoreMock.setCanShowKeyMoments).toHaveBeenCalledExactlyOnceWith(true)
    })
  })

  describe('clearCurrentEntity', () => {
    it('should reset all stores and clear local storage', () => {
      CurrentEntityManager.clearCurrentEntity()

      expect(currentEntityStoreMock.setCurrentEntity).toHaveBeenCalledOnce()
      expect(permissionsStoreMock.setCurrentEntityPermissions).toHaveBeenCalledExactlyOnceWith([])
      expect(invoicesAccessStoreMock.reset).toHaveBeenCalledOnce()
      expect(keyMomentsAccessStoreMock.reset).toHaveBeenCalledOnce()
      expect(removeLastVisitedEntityIdMock).toHaveBeenCalledOnce()
    })
  })
})
