import type { UserInfo } from '../../stores/types'
import { VITE_GIGYA_SSO_ACTIVATED } from 'env-vars'
import { useUserStore } from '../../stores/user/user.store'
import { arrayIncludes } from '@pulse/core/utils/array'
import { logoutCollaborator, logoutGigyaSSO, logoutClient } from '../../utils'
import { fetchCurrentUser } from '../../services/current-user/current-user.service'
import { usePermissionsStore } from '../../stores/permissions/permissions.store'
import { useTokenStore } from '../../stores/token/token.store'
import { storeToRefs } from 'pinia'

export class CurrentUserManager {
  static async setCurrentUser(user?: UserInfo) {
    const permissionsStore = usePermissionsStore()
    const userStore = useUserStore()

    userStore.setUser(user)
    permissionsStore.setUserPermissions([])
    permissionsStore.setSelectedEntityPermissions([])
  }

  static async initializeCurrentUser() {
    const user = await fetchCurrentUser()
    this.setCurrentUser(user)
  }

  static async logout() {

    this.persistToken('')
    const userStore = useUserStore()

    const isCollab = userStore.isCollab
    const gigyaUserId = userStore.gigyaUserId

    this.setCurrentUser()

    if (isCollab) {
      logoutCollaborator()
      return
    }
    if (gigyaUserId) {
      if (VITE_GIGYA_SSO_ACTIVATED === 'true') {
        logoutGigyaSSO()
      }
      logoutClient(gigyaUserId)
    }
  }

  static readonly hasPermission = (
    permissionCode: string | string[],
  ): boolean => {
    const permissionsStore = usePermissionsStore()

    const { userPermissions, selectedEntityPermissions } = storeToRefs(permissionsStore)
    const permissionsList = [...(selectedEntityPermissions.value || []), ...(userPermissions.value || [])]

    return arrayIncludes(permissionsList, permissionCode)
  }

  static persistToken(token: string) {
    const tokenStore = useTokenStore()
    tokenStore.setToken(token)
    this.saveTokenLocally(token)
  }

  static saveTokenLocally(token: string) {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }

  static getTokenLocally() {
    return localStorage.getItem('token')
  }

  static initToken() {
    const tokenStore = useTokenStore()
    const storedToken = this.getTokenLocally()
    if (storedToken) {
      tokenStore.setToken(storedToken)
    }
  }
}
