import type { Entity } from '../../stores/types'
import { useSelectedEntityStore } from '../../stores/selected-entity/selected-entity.store'
import { usePermissionsStore } from '../../stores/permissions/permissions.store'
import { fetchUserAccountPermissions } from '../../services/permissions/permissions.service'

export class SelectedEntityManager {
  static async defineSelectedEntity(entity: Entity) {
    const { accountId } = entity

    const permissionsStore = usePermissionsStore()
    const userAccountPermissions = await fetchUserAccountPermissions(accountId)
    permissionsStore.setSelectedEntityPermissions(userAccountPermissions)

    const selectedEntityStore = useSelectedEntityStore()
    selectedEntityStore.setSelectedEntity(entity)
    localStorage.setItem('selected-entity', JSON.stringify(entity))
  }
}
