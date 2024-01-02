import api from '../api'
import store from '../stores'
import { storeToRefs } from 'pinia'

export const useDataProvider = () => {
  const { isAuthenticated } = storeToRefs(store())
  const fetchUserData = async () => {
    if (isAuthenticated.value) {
      const {
        data: { firstName, lastName, id, email, isCustomer }
      } = await api().customers.get('contacts/me')
      const user = {
        id,
        firstName,
        lastName,
        email,
        isCollab: !isCustomer
      }
      return user
    }
    return null
  }
  return { fetchUserData }
}
