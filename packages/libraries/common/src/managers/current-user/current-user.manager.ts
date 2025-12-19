import type { UserInfo } from '../../stores/types'
import { VITE_GIGYA_SSO_ACTIVATED } from 'env-vars'
import { useUserStore } from '../../stores/user/user.store'
import { arrayIncludes } from '@pulse/toolbox/utils/array'
import { logoutCollaborator, logoutGigyaSSO, logoutUser } from '../../utils/user.utils'
import { CurrentUserService } from '../../services/current-user/current-user.service'
import { usePermissionsStore } from '../../stores/permissions/permissions.store'
import { useTokenStore } from '../../stores/token/token.store'
import { storeToRefs } from 'pinia'
import { CurrentEntityManager } from '../current-entity/current-entity.manager'
import { ACCOUNT_PERMISSIONS } from '../../constants/permissions.const'
import { PermissionScope } from './current-user.manager.enum'
import type { Permission } from '../../types/permission.type'

export class CurrentUserManager {
  static async setCurrentUser(currentUser?: UserInfo) {
    const permissionsStore = usePermissionsStore()
    const userStore = useUserStore()

    userStore.setUser(currentUser)
    permissionsStore.setUserPermissions([])
    permissionsStore.setCurrentEntityPermissions([])
  }

  static async initializeCurrentUser() {
    const currentUser = await CurrentUserService.getCurrentUser()
    this.setCurrentUser(currentUser)
  }

  static async logout() {
    const userStore = useUserStore()

    const isCollab = userStore.isCollab

    this.setCurrentUser()

    // Logout User (Collab or Customer)
    await logoutUser()

    if (isCollab) {
      await logoutCollaborator()
    }

    if (VITE_GIGYA_SSO_ACTIVATED === 'true') {
      logoutGigyaSSO()
    }

    // clean localStorage
    this.persistToken('')
    CurrentEntityManager.clearCurrentEntity()
  }

  private static readonly getCurrentPermissions = (
    scope: PermissionScope,
  ): Permission[] => {
    const permissionsStore = usePermissionsStore()

    const { userPermissions, currentEntityPermissions } = storeToRefs(permissionsStore)
    const userPermissionsList = userPermissions.value
    const currentEntityPermissionsList = currentEntityPermissions.value

    if (scope === PermissionScope.ALL) {
      return [
        ...userPermissionsList,
        ...currentEntityPermissionsList,
      ]
    }

    if (scope === PermissionScope.CURRENT_ENTITY) {
      return currentEntityPermissionsList
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
   * return true if the user has the permission in the current entity scope
   */
  static readonly hasCurrentEntityPermission = (
    permissionCodes: Permission[],
  ): boolean => {
    return CurrentUserManager.hasScopedPermission(PermissionScope.CURRENT_ENTITY, permissionCodes)
  }

  static hasCurrentEntityPennylanePermission() {
    return CurrentUserManager.hasCurrentEntityPermission(ACCOUNT_PERMISSIONS.PENNYLANE)
  }

  static persistToken(token: string) {
    this.saveToken(token)
  }

  static saveToken(token: string) {
    const tokenStore = useTokenStore()
    if (token) {
      tokenStore.setToken(token)
    } else {
      tokenStore.removeToken()
    }
  }

  static getToken() {
    const tokenStore = useTokenStore()
    return tokenStore.getToken()
  }

  static initToken() {
    const storedToken = this.getToken()
    if (storedToken) {
      const tokenStore = useTokenStore()
      tokenStore.setToken(storedToken)
    }
  }

  static hasToken() {
    return !!this.getToken()
  }

  static isAuthenticated() {
    const tokenStore = useTokenStore()
    const hasActiveToken = tokenStore.hasActiveToken()

    if (hasActiveToken === false) {
      // if the token is expired or invalid, delete it
      tokenStore.removeToken()
    }

    return hasActiveToken
  }
}
