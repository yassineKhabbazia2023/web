import {
  APP_VERSION_CHECK_THROTTLE_DELAY_IN_MS,
  APP_VERSION_FILE_NAME,
  APP_VERSION_RELOAD_STORAGE_KEY,
} from '../constants/new-version.consts'

/**
 * Detects, in an already opened tab, that a new version has been deployed,
 * so that the next navigation performs a full page load instead of a client-side one.
 *
 * The current build id is injected at build time by the `pulse:app-version` Vite plugin.
 * Without it (dev server, tests), detection is disabled.
 */
export class NewVersionManager {
  private static availableBuildId: string | null = null
  private static lastCheckTimestamp = 0
  private static isWatching = false

  static getCurrentBuildId(): string | undefined {
    return import.meta.env.VITE_APP_BUILD_ID
  }

  static startWatching(): void {
    if (NewVersionManager.isWatching || NewVersionManager.getCurrentBuildId() === undefined) {
      return
    }
    NewVersionManager.isWatching = true
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        NewVersionManager.checkForNewVersion()
      }
    })
  }

  static async checkForNewVersion(): Promise<void> {
    const currentBuildId = NewVersionManager.getCurrentBuildId()
    const now = Date.now()
    const isThrottled = now - NewVersionManager.lastCheckTimestamp < APP_VERSION_CHECK_THROTTLE_DELAY_IN_MS
    if (currentBuildId === undefined || isThrottled) {
      return
    }
    NewVersionManager.lastCheckTimestamp = now

    try {
      const response = await fetch(`${import.meta.env.BASE_URL}${APP_VERSION_FILE_NAME}`, { cache: 'no-store' })
      if (response.ok === false) {
        return
      }
      const appVersion: { buildId?: unknown } = await response.json()
      if (typeof appVersion.buildId === 'string' && appVersion.buildId !== currentBuildId) {
        NewVersionManager.availableBuildId = appVersion.buildId
      }
    } catch {
      // Network errors are ignored: the check will be retried later
    }
  }

  /**
   * Returns true when a new version is available and has not already triggered a reload,
   * to avoid reload loops if the browser keeps serving a stale index.html.
   */
  static consumeReload(): boolean {
    const availableBuildId = NewVersionManager.availableBuildId
    if (availableBuildId === null) {
      return false
    }
    try {
      if (sessionStorage.getItem(APP_VERSION_RELOAD_STORAGE_KEY) === availableBuildId) {
        return false
      }
      sessionStorage.setItem(APP_VERSION_RELOAD_STORAGE_KEY, availableBuildId)
    } catch {
      return false
    }
    return true
  }
}

