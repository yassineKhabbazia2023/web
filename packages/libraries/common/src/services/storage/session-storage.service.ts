import { logger } from '@pulse/toolbox'

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
}
