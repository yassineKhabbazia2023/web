import type { UserInfo } from '../../types/user.type'
import { useUserStore } from '../../stores/user/user.store'
import { arrayIncludes } from '@pulse/toolbox/utils/array'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { logoutUser } from '../../services/authentication.service'
import { LogoutService } from '../../services/logout/logout.service'
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

  // Clears both the persisted token and the user/permissions store. Use this
  // for rollback paths in login strategies/composables when partial state must
  // be wiped after a failure (e.g. invalid userId, getCurrentUser throws).
  static clearUser() {
    this.persistToken('')
    this.setCurrentUser()
  }

  static async initializeCurrentUser() {
    const currentUser = await CurrentUserService.getCurrentUser()
    this.setCurrentUser(currentUser)
  }

  private static logoutPromise: Promise<void> | null = null

  static async logout() {
    // Dedup concurrent callers: when several in-flight requests hit 401 in
    // parallel, each triggers the unauthorized callback and would otherwise
    // start its own logout. They all await the same logout instead, so the
    // backend /logout call and SDK cleanup run exactly once.
    if (CurrentUserManager.logoutPromise !== null) {
      return CurrentUserManager.logoutPromise
    }

    CurrentUserManager.logoutPromise = CurrentUserManager.runLogout()
      .finally(() => {
        CurrentUserManager.logoutPromise = null
      })

    return CurrentUserManager.logoutPromise
  }

  private static async runLogout() {
    this.setCurrentUser()

    // Each cleanup step is isolated so a failure in one (e.g. backend down)
    // does not skip the others. In particular, the SDK cleanup MUST run even
    // if the backend logout failed, otherwise the MSAL/Gigya SSO session
    // stays alive and the next page load re-authenticates the user.
    const errors: unknown[] = []

    try {
      await logoutUser()
    } catch (error) {
      errors.push(error)
    }

    try {
      // Run app-specific cleanup strategies (e.g. MSAL logout for collaborator,
      // Gigya logoutSSO for customer). Each app registers its strategy at boot.
      await LogoutService.logout()
    } catch (error) {
      errors.push(error)
    }

    // Always clean localStorage, otherwise a stale token would let the next
    // page load look authenticated. The token-provider observes this clear
    // to skip restoring after an in-flight refresh resolves.
    this.persistToken('')
    CurrentEntityManager.clearCurrentEntity()

    if (errors.length > 0) {
      // Surface the first error so the caller knows logout was partial.
      throw errors[0]
    }
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
    const tokenStore = useTokenStore()
    if (isNotNullNorEmpty(token)) {
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
