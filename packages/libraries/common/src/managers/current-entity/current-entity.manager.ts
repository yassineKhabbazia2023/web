import type { EntitySummary } from '@pulse/common/types'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { logger } from '@pulse/toolbox'
import { usePermissionsStore } from '../../stores/permissions/permissions.store'
import { useInvoicesAccessStore } from '../../stores/invoices-access/invoices-access.store'
import { fetchUserAccountPermissions } from '../../services/permissions/permissions.service'
import { InvoicesAccessService } from '../../services/invoices-access/invoices-access.service'
import { LocalStorageService } from '../../services/storage'

export class CurrentEntityManager {
  static async initializeCurrentEntity(entity: EntitySummary) {
    const { accountId } = entity

    const permissionsStore = usePermissionsStore()
    const userAccountPermissions = await fetchUserAccountPermissions(accountId)
    permissionsStore.setCurrentEntityPermissions(userAccountPermissions)

    const currentEntityStore = useCurrentEntityStore()
    currentEntityStore.setCurrentEntity(entity)
    CurrentEntityManager.setLocalStorageEntityId(accountId)

    await CurrentEntityManager.fetchInvoicesAccess(entity)
  }

  static async fetchInvoicesAccess(entity: EntitySummary) {
    const invoicesAccessStore = useInvoicesAccessStore()

    try {
      const accessData = await InvoicesAccessService.fetchInvoicesAccess(entity.accountId)
      invoicesAccessStore.setAccessData(accessData)
    } catch (error) {
      logger.error('Failed to fetch invoices access data', error)
      invoicesAccessStore.setAccessData(null)
    }
  }

  static setLocalStorageEntityId(entityId: number | null | undefined) {
    if (entityId === null || entityId === undefined) {
      CurrentEntityManager.clearLocalStorageEntityId()
    } else {
      LocalStorageService.setLastVisitedEntityId(entityId)
    }
  }

  static getLocalStorageEntityId() {
    return LocalStorageService.getLastVisitedEntityId()
  }

  static clearLocalStorageEntityId() {
    LocalStorageService.removeLastVisitedEntityId()
  }

  static clearCurrentEntity() {
    // remove current entity from the store
    const currentEntityStore = useCurrentEntityStore()
    currentEntityStore.setCurrentEntity()
    // remove current entity permissions from the store
    const permissionsStore = usePermissionsStore()
    permissionsStore.setCurrentEntityPermissions([])
    // reset invoices access store
    const invoicesAccessStore = useInvoicesAccessStore()
    invoicesAccessStore.reset()
    // clear local storage
    CurrentEntityManager.clearLocalStorageEntityId()
  }
}
