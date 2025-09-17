import type { EntitySummary } from '@pulse/common/types'
import { useSelectedEntityStore } from '@pulse/common/stores'
import { usePermissionsStore } from '../../stores/permissions/permissions.store'
import { fetchUserAccountPermissions } from '../../services/permissions/permissions.service'
import { LocalStorageService } from '../../services/storage'

export class SelectedEntityManager {
  static async initializeSelectedEntity(entity: EntitySummary) {
    const { accountId } = entity

    const permissionsStore = usePermissionsStore()
    const userAccountPermissions = await fetchUserAccountPermissions(accountId)
    permissionsStore.setSelectedEntityPermissions(userAccountPermissions)

    const selectedEntityStore = useSelectedEntityStore()
    selectedEntityStore.setSelectedEntity(entity)
    SelectedEntityManager.setLocalStorageEntityId(accountId)
  }

  static setLocalStorageEntityId(entityId: number | null | undefined) {
    if (entityId === null || entityId === undefined) {
      SelectedEntityManager.clearLocalStorageEntityId()
    } else {
      LocalStorageService.setSelectedEntityId(entityId)
    }
  }

  static getLocalStorageEntityId() {
    return LocalStorageService.getSelectedEntityId()
  }

  static clearLocalStorageEntityId() {
    LocalStorageService.removeSelectedEntityId()
  }

  static clearSelectedEntity() {
    // remove selected entity from the store
    const selectedEntityStore = useSelectedEntityStore()
    selectedEntityStore.setSelectedEntity()
    // remove selected entity permissions from the store
    const permissionsStore = usePermissionsStore()
    permissionsStore.setSelectedEntityPermissions([])
    // clear local storage
    SelectedEntityManager.clearLocalStorageEntityId()
  }
}
