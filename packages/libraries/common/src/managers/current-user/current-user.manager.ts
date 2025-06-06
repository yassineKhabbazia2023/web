import type { UserInfo } from '../../stores/types'
import { VITE_GIGYA_SSO_ACTIVATED } from 'env-vars'
import { useUserStore } from '../../stores/user/user.store'
import { arrayIncludes } from '@pulse/core/utils/array'
import { logoutCollaborator, logoutGigyaSSO, logoutClient } from '../../utils'
import { fetchCurrentUser } from '../../services/current-user/current-user.service'
import { usePermissionsStore } from '../../stores/permissions/permissions.store'
import { useTokenStore } from '../../stores/token/token.store'
import { storeToRefs } from 'pinia'
import { TokenManager } from '../token/token.manager'
import { SelectedEntityManager } from '../selected-entity/selected-entity.manager'

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
    const userStore = useUserStore()

    const isCollab = userStore.isCollab
    const gigyaUserId = userStore.gigyaUserId

    this.setCurrentUser()

    if (isCollab) {
      logoutCollaborator()
    }
    if (gigyaUserId) {
      if (VITE_GIGYA_SSO_ACTIVATED === 'true') {
        logoutGigyaSSO()
      }
      logoutClient(gigyaUserId)
    }
    // clean localStorage
    this.persistToken('')
    SelectedEntityManager.clearSelectedEntity()
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
    this.saveToken(token)
    const tokenStore = useTokenStore()
    tokenStore.setTokenExpiration(token)
  }

  static saveToken(token: string) {
    if (token) {
      TokenManager.setToken(token)
    } else {
      TokenManager.removeToken()
    }
  }

  static getToken() {
    return TokenManager.getToken()
  }

  static initToken() {
    const storedToken = this.getToken()
    if (storedToken) {
      const tokenStore = useTokenStore()
      tokenStore.setTokenExpiration(storedToken)
    }
  }

  static isAuthenticated() {
    return TokenManager.getToken() !== ''
  }
}
