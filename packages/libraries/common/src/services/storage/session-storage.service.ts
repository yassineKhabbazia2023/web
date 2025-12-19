import { logger } from '@pulse/toolbox'
import type { SsoProvider } from './session-storage.service.enums'
import type { SamlSsoContext } from './session-storage.service.types'

const SAML_SSO_KEY_PREFIX = 'saml-sso-context'

/**
 * Service to handle all sessionStorage operations
 * Centralizes sessionStorage access for better testability and error handling
 */
export class SessionStorageService {

  // #region Generic storage methods

  /**
   * Safely get item from sessionStorage
   */
  private static getItem(key: string): string | undefined {
    try {
      return sessionStorage.getItem(key) ?? undefined
    } catch (error) {
      logger.error(`Failed to get item from sessionStorage: ${key}`, error)
      return undefined
    }
  }

  /**
   * Safely set item in sessionStorage
   */
  private static setItem(key: string, value: string): void {
    try {
      sessionStorage.setItem(key, value)
    } catch (error) {
      logger.error(`Failed to set item in sessionStorage: ${key}`, error)
    }
  }

  /**
   * Safely remove item from sessionStorage
   */
  private static removeItem(key: string): void {
    try {
      sessionStorage.removeItem(key)
    } catch (error) {
      logger.error(`Failed to remove item from sessionStorage: ${key}`, error)
    }
  }

  // #endregion

  // #region SAML SSO Context (Pennylane SSO redirect)

  private static getSamlSsoKey(spName: SsoProvider): string {
    return `${SAML_SSO_KEY_PREFIX}-${spName}`
  }

  static setSamlSsoContext(context: SamlSsoContext): void {
    this.setItem(this.getSamlSsoKey(context.spName), JSON.stringify(context))
  }

  static getSamlSsoContext(spName: SsoProvider): SamlSsoContext | undefined {
    const value = this.getItem(this.getSamlSsoKey(spName))
    if (value === undefined) {
      return undefined
    }
    try {
      return JSON.parse(value) as SamlSsoContext
    } catch {
      return undefined
    }
  }

  static removeSamlSsoContext(spName: SsoProvider): void {
    this.removeItem(this.getSamlSsoKey(spName))
  }

  static hasSamlSsoContext(spName: SsoProvider): boolean {
    return this.getSamlSsoContext(spName) !== undefined
  }

  /**
   * Get and remove SAML SSO context in one atomic operation
   * Returns undefined if no context exists
   */
  static consumeSamlSsoContext(spName: SsoProvider): SamlSsoContext | undefined {
    const context = this.getSamlSsoContext(spName)
    if (context !== undefined) {
      this.removeSamlSsoContext(spName)
    }
    return context
  }

  // #endregion
}
