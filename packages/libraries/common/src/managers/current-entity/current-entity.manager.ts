import type { EntitySummary } from '@pulse/common/types'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { usePermissionsStore } from '../../stores/permissions/permissions.store'
import { fetchUserAccountPermissions } from '../../services/permissions/permissions.service'
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
    // clear local storage
    CurrentEntityManager.clearLocalStorageEntityId()
  }
}
