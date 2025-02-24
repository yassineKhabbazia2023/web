import api from '../api'
import store from '../stores'
import { storeToRefs } from 'pinia'

export const useDataProvider = () => {
  const commonStore = store()
  const { isAuthenticated } = storeToRefs(commonStore)

  const fetchUserData = async () => {
    if (isAuthenticated.value) {
      await commonStore.fetchUserPermissions()
      const {
        data: { firstName, lastName, id, email, officeMobile, isCustomer, oldId, persona },
      } = await api().gateway.get('contact/me')
      const user = {
        id,
        firstName,
        lastName,
        email,
        officeMobile,
        isCollab: !isCustomer,
        oldId,
        persona,
      }
      return user
    }
    return null
  }
  return { fetchUserData }
}
