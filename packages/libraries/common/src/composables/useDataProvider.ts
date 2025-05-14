import api from '../api'
import { usePermissionsStore } from '../stores/permissions/permissions.store'
import { fetchUserPermissions } from '../services/permissions/permissions.service'
import { UserInfo } from '../stores/types'
import { CurrentUserManager } from '@pulse/common/managers'

export const useDataProvider = () => {
  const permissionsStore = usePermissionsStore()

  const fetchUserData = async () => {
    if (CurrentUserManager.isAuthenticated()) {
      const userPermissions = await fetchUserPermissions()
      permissionsStore.setUserPermissions(userPermissions)
      const {
        data: { firstName, lastName, id, email, officeMobile, isCustomer, oldId, persona },
      } = await api().gateway.get('contact/me')
      const user: UserInfo = {
        id,
        firstName,
        lastName,
        email,
        officeMobile,
        isCollab: !isCustomer,
        oldId,
        persona,
        occupation: '',
        entities: {
          default: undefined,
        },
        gigyaUserId: '',
      }
      return user
    }
  }
  return { fetchUserData }
}
