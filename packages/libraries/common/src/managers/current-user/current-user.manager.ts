import type { UserInfo } from '../../stores/types'
import { VITE_GIGYA_SSO_ACTIVATED } from 'env-vars'
import { useUserStore } from '../../stores/user/user.store'
import { arrayIncludes } from '@pulse/core/utils/array'
import { logoutCollaborator, logoutGigyaSSO, logoutClient } from '../../utils'
import { CurrentUserService } from '../../services/current-user/current-user.service'
import { usePermissionsStore } from '../../stores/permissions/permissions.store'
import { useTokenStore } from '../../stores/token/token.store'
import { storeToRefs } from 'pinia'
import { TokenManager } from '../token/token.manager'
import { SelectedEntityManager } from '../selected-entity/selected-entity.manager'
import { PERMISSION_ACCOUNT } from '../../constants/permissions'

export class CurrentUserManager {
  static async setCurrentUser(currentUser?: UserInfo) {
    const permissionsStore = usePermissionsStore()
    const userStore = useUserStore()

    userStore.setUser(currentUser)
    permissionsStore.setUserPermissions([])
    permissionsStore.setSelectedEntityPermissions([])
  }

  static async initializeCurrentUser() {
    const currentUser = await CurrentUserService.getCurrentUser()
    this.setCurrentUser(currentUser)
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

  static getHasGedComptaPermission() {
    return CurrentUserManager.hasPermission(PERMISSION_ACCOUNT.GED_COMPTA)
  }

  static getHasPennylanePermission() {
    return CurrentUserManager.hasPermission(PERMISSION_ACCOUNT.PENNYLANE)
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
