import { commonApi, commonStore as store } from '@kpmg/common'
import { getToken } from '@/services/msal'
import { useRouter } from 'vue-router'

export const useInitAuth = () => {
  const router = useRouter()
  const initAuth = async () => {
    await getToken()
    const token = sessionStorage.getItem('token')
    if (token) {
      store().$patch({
        user: {
          token
        }
      })
      const {
        data: { firstName, lastName, id, email }
      } = await commonApi().customers.get('contacts/me')
      store().$patch({
        user: {
          token,
          id: id,
          firstName: firstName,
          lastName: lastName,
          email: email
        }
      })
      router.push('/')
    }
  }
  return { initAuth }
}
