import api from '../api'
import { usePermissionsStore } from '../stores/permissions/permissions.store'
import { fetchUserPermissions } from '../services/permissions/permissions.service'
import { UserInfo } from '../stores/types'
import { useUserStore } from '@pulse/common/stores'

export const useDataProvider = () => {
  const permissionsStore = usePermissionsStore()
  const userStore = useUserStore()

  const fetchUserData = async () => {
    if (userStore.isAuthenticated) {
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
