import type { Entity } from '../../stores/types'
import { useSelectedEntityStore } from '@pulse/common/stores'
import { usePermissionsStore } from '../../stores/permissions/permissions.store'
import { fetchUserAccountPermissions } from '../../services/permissions/permissions.service'

export const LOCAL_STORAGE_SELECTED_ENTITY_KEY = 'selected-entity'

export class SelectedEntityManager {
  static async initializeSelectedEntity(entity: Entity) {
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
      localStorage.setItem(LOCAL_STORAGE_SELECTED_ENTITY_KEY, JSON.stringify(entityId))
    }
  }

  static getLocalStorageEntityId() {
    const localStorageEntityId = Number(localStorage.getItem(LOCAL_STORAGE_SELECTED_ENTITY_KEY))
    return isNaN(localStorageEntityId) ? undefined : localStorageEntityId
  }

  static clearLocalStorageEntityId() {
    localStorage.removeItem(LOCAL_STORAGE_SELECTED_ENTITY_KEY)
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
