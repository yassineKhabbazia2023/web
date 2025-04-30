import type { Entity } from '../../stores/types'
import { useSelectedEntityStore } from '@pulse/common/stores'
import { usePermissionsStore } from '../../stores/permissions/permissions.store'
import { fetchUserAccountPermissions } from '../../services/permissions/permissions.service'

export const LOCAL_STORAGE_SELECTED_ENTITY_KEY = 'selected-entity'

export class SelectedEntityManager {
  static async persistSelectedEntity(entity: Entity) {
    const { accountId } = entity

    const permissionsStore = usePermissionsStore()
    const userAccountPermissions = await fetchUserAccountPermissions(accountId)
    permissionsStore.setSelectedEntityPermissions(userAccountPermissions)

    const selectedEntityStore = useSelectedEntityStore()
    selectedEntityStore.setSelectedEntity(entity)
    localStorage.setItem(LOCAL_STORAGE_SELECTED_ENTITY_KEY, JSON.stringify(entity))
  }

  static getSelectedEntity() {
    const selectedEntityInLocalStorage = localStorage.getItem(LOCAL_STORAGE_SELECTED_ENTITY_KEY)
    const selectedEntityStore = useSelectedEntityStore()
    const storedSelectedEntity = selectedEntityStore.selectedEntity

    if (selectedEntityInLocalStorage) {
      return JSON.parse(selectedEntityInLocalStorage) as Entity
    } else if (storedSelectedEntity) {
      return storedSelectedEntity
    } else {
      return undefined
    }
  }

  static clearSelectedEntity() {
    const selectedEntityStore = useSelectedEntityStore()
    selectedEntityStore.setSelectedEntity()
    localStorage.removeItem(LOCAL_STORAGE_SELECTED_ENTITY_KEY)
  }
}
