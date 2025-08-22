import type { UserInfo } from '../../stores/types'
import { VITE_GIGYA_SSO_ACTIVATED } from 'env-vars'
import { useUserStore } from '../../stores/user/user.store'
import { arrayIncludes } from '@pulse/core/utils/array'
import { logoutCollaborator, logoutGigyaSSO, logoutClient } from '../../utils/user.utils'
import { CurrentUserService } from '../../services/current-user/current-user.service'
import { usePermissionsStore } from '../../stores/permissions/permissions.store'
import { useTokenStore } from '../../stores/token/token.store'
import { storeToRefs } from 'pinia'
import { TokenManager } from '../token/token.manager'
import { SelectedEntityManager } from '../selected-entity/selected-entity.manager'
import { ACCOUNT_PERMISSIONS } from '../../constants/permissions.const'
import { PermissionScope } from './current-user.manager.enum'
import type { Permission } from '../../types/permission.type'

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

  private static readonly getCurrentPermissions = (
    scope: PermissionScope,
  ): Permission[] => {
    const permissionsStore = usePermissionsStore()

    const { userPermissions, selectedEntityPermissions } = storeToRefs(permissionsStore)
    const userPermissionsList = userPermissions.value
    const selectedEntityPermissionsList = selectedEntityPermissions.value

    if (scope === PermissionScope.ALL) {
      return [
        ...userPermissionsList,
        ...selectedEntityPermissionsList,
      ]
    }

    if (scope === PermissionScope.SELECTED_ENTITY) {
      return selectedEntityPermissionsList
    }

    return userPermissionsList // scope === PermissionScope.GLOBAL here
  }

  private static readonly hasScopedPermission = (
    scope: PermissionScope,
    permissionCodes: Permission[],
  ): boolean => {
    const permissionsList = CurrentUserManager.getCurrentPermissions(scope)

    return arrayIncludes(permissionsList, permissionCodes)
  }

  /**
   * return true if the user has the permission in any scope
   */
  static readonly hasPermission = (
    permissionCodes: Permission[],
  ): boolean => {
    return CurrentUserManager.hasScopedPermission(PermissionScope.ALL, permissionCodes)
  }

  /**
   * returns true if the user has the permission in global scope
   */
  static readonly hasGlobalPermission = (
    permissionCodes: Permission[],
  ): boolean => {
    return CurrentUserManager.hasScopedPermission(PermissionScope.GLOBAL, permissionCodes)
  }

  /**
   * return true if the user has the permission in the selected entity scope
   */
  static readonly hasSelectedEntityPermission = (
    permissionCodes: Permission[],
  ): boolean => {
    return CurrentUserManager.hasScopedPermission(PermissionScope.SELECTED_ENTITY, permissionCodes)
  }

  static hasGedComptaPermission() {
    return CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.GED_COMPTA)
  }

  static hasSelectedEntityPennylanePermission() {
    return CurrentUserManager.hasSelectedEntityPermission(ACCOUNT_PERMISSIONS.PENNYLANE)
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
    const hasActiveToken = TokenManager.hasActiveToken()

    if (hasActiveToken === false) {
      // if the token is expired or invalid, delete it
      TokenManager.removeToken()
    }

    return hasActiveToken
  }
}
