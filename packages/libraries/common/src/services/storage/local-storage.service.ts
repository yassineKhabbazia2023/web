import { logger } from '@pulse/toolbox'

const LOCAL_STORAGE_TOKEN_KEY = 'token'
const LOCAL_STORAGE_SELECTED_ENTITY_KEY = 'selected-entity'

/**
 * Service to handle all localStorage operations
 * Centralizes localStorage access for better testability and error handling
 */
export class LocalStorageService {

  // #region Generic storage methods

  /**
   * Safely get item from localStorage
   */
  private static getItem(key: string): string | undefined {
    try {
      return localStorage.getItem(key) ?? undefined
    } catch (error) {
      logger.error(`Failed to get item from localStorage: ${key}`, error)
      return undefined
    }
  }

  /**
   * Safely set item in localStorage
   */
  private static setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      logger.error(`Failed to set item in localStorage: ${key}`, error)
    }
  }

  /**
   * Safely remove item from localStorage
   */
  private static removeItem(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      logger.error(`Failed to remove item from localStorage: ${key}`, error)
    }
  }

  // #endregion

  // #region token

  static setToken(token: string): void {
    this.setItem(LOCAL_STORAGE_TOKEN_KEY, token)
  }

  static getToken(): string {
    return this.getItem(LOCAL_STORAGE_TOKEN_KEY) ?? ''
  }

  static removeToken(): void {
    this.removeItem(LOCAL_STORAGE_TOKEN_KEY)
  }

  // #endregion

  // #region selected entity

  static setSelectedEntityId(entityId: number): void {
    this.setItem(LOCAL_STORAGE_SELECTED_ENTITY_KEY, JSON.stringify(entityId))
  }

  static getSelectedEntityId(): number | undefined {
    const value = this.getItem(LOCAL_STORAGE_SELECTED_ENTITY_KEY)
    if (!value) {
      return undefined
    }
    const parsed = Number(value)
    return isNaN(parsed) ? undefined : parsed
  }

  static removeSelectedEntityId(): void {
    this.removeItem(LOCAL_STORAGE_SELECTED_ENTITY_KEY)
  }

  // #endregion

}
