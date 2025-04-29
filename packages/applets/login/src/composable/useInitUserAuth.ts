
import { amplitudeService, dataProvider } from '@pulse/common'
import { CurrentUserManager, TokenManager } from '@pulse/common/managers'
import { useUserStore } from '@pulse/common/stores'
import { getMSALToken } from '@login/services/msal'
import { ref } from 'vue'

export default function useInitUserAuth() {
  const userStore = useUserStore()
  const isTokenRetrieve = ref(false)
  const { fetchUserData } = dataProvider()

  const setStoreGigyaUserId = (gigyaUserId: string) => {
    const token = TokenManager.getToken()

    if (token) {
      userStore.setGigyaUserId(gigyaUserId)
    }
  }

  const initAuthClient = async () => {
    const token = TokenManager.getToken()
    isTokenRetrieve.value = !!token
    if (token) {
      await updateUserState()
      const userId = userStore.getUserId()
      if(userId) {
        amplitudeService.identifyCustomer()
        amplitudeService.setUserId(userId.toString())
        // we only track the sign in success when the userId exists
        // this is to avoid tracking the sign in success with unknown user
        amplitudeService.track('Sign In Completed', {
          sign_in_method: 'email',
          sign_in_result: 'succeeded',
        })
      }
    }
  }
  const initAuthCollab = async () => {
    const token = await getMSALToken()
    CurrentUserManager.persistToken(token)
    isTokenRetrieve.value = !!token
    if (token) {
      await updateUserState()
      const userId = userStore.getUserId()
      if(userId) {
        amplitudeService.identifyCollaborator()
        amplitudeService.setUserId(userId.toString())
        // we only track the sign in success when the userId exists
        // this is to avoid tracking the sign in success with unknown user
        amplitudeService.track('Sign In Completed', {
          sign_in_method: 'SSO',
          sign_in_result: 'succeeded',
        })
      }
    }
  }
  const updateUserState = async () => {
    const data = await fetchUserData()
    userStore.setUser(data)

    return data
  }

  return { initAuthCollab, initAuthClient, isTokenRetrieve, setStoreGigyaUserId }
}
