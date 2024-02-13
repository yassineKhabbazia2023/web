
import { dataProvider, commonStore as store, tokenService } from '@kpmg/common'
import { getToken } from '@/services/msal'
import { ref } from 'vue'

export default function useInitUserAuth() {
  const isTokenRetrieve = ref(false)
  const { fetchUserData } = dataProvider()
  const initAuthClient = async () => {
    const token = tokenService.getToken()
    isTokenRetrieve.value = !!token
    if (token) {
      await updateUserState(token)
    }
  }
  const initAuthCollab = async () => {
    const token = await getToken()
    isTokenRetrieve.value = !!token
    if (token) {
      await updateUserState(token)
    }
  }
  const updateUserState = async (token: string) => {
    tokenService.setToken(token)
    const data = await fetchUserData()
    store().$patch({
      user: {
        id: data?.id,
        firstName: data?.firstName,
        lastName: data?.lastName,
        email: data?.email,
        isCollab: data?.isCollab
      }
    })
  }

  return { initAuthCollab, initAuthClient, isTokenRetrieve }
}
