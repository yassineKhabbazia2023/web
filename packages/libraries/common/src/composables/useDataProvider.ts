import api from '../api'
import { useTokenStore } from '../stores/token/token.store'
import { storeToRefs } from 'pinia'
import { usePermissionsStore } from '../stores/permissions/permissions.store'
import { fetchUserPermissions } from '../services/permissions/permissions.service'
import { UserInfo } from '../stores/types'

export const useDataProvider = () => {
  const permissionsStore = usePermissionsStore()
  const tokenStore = useTokenStore()
  const { isAuthenticated } = storeToRefs(tokenStore)

  const fetchUserData = async () => {
    if (isAuthenticated.value) {
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
