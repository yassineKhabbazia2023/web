import { OpenFeature } from '@openfeature/web-sdk'
import type { EvaluationDetails, FlagValue, JsonValue } from '@openfeature/web-sdk'
import { ConfigCatWebProvider } from '@openfeature/config-cat-web-provider'
import { DataGovernance } from '@configcat/sdk'
import { logger } from '@pulse/toolbox'
import type { OpenFeatureInitOptions } from './open-feature.types'

/**
 * Wrapper around the OpenFeature Web SDK backed by ConfigCat (EU-only).
 *
 * {@link init} is **async** and must be `await`ed before `createApp()` so that
 * feature flags are ready for the first render (e.g. route guards).
 * All getters are **synchronous** and return the `defaultValue` when the
 * provider is not yet initialized or when the evaluation fails.
 * Evaluation errors are logged via `logger.trace`.
 *
 * @see https://configcat.com/docs/sdk-reference/js/browser/#creating-the-configcat-client
 */
export class OpenFeatureService {
  private static initialized = false

  /** Initializes the ConfigCat provider. Must be called before any flag evaluation. */
  static async init(sdkKey: string, options?: OpenFeatureInitOptions): Promise<void> {
    try {
      const provider = ConfigCatWebProvider.create(sdkKey, {
        dataGovernance: DataGovernance.EuOnly,
        flagOverrides: options?.flagOverrides,
      })
      await OpenFeature.setProviderAndWait(provider)
      OpenFeatureService.initialized = true
      logger.info('OpenFeature initialized with ConfigCat provider')
    } catch (error) {
      logger.error('Failed to initialize OpenFeature', error)
    }
  }

  static getBooleanValue(flagKey: string, defaultValue = false): boolean {
    if (OpenFeatureService.initialized === false) {
      return defaultValue
    }

    const details = OpenFeature.getClient().getBooleanDetails(flagKey, defaultValue)
    return OpenFeatureService.extractValue(details)
  }

  static getStringValue(flagKey: string, defaultValue = ''): string {
    if (OpenFeatureService.initialized === false) {
      return defaultValue
    }

    const details = OpenFeature.getClient().getStringDetails(flagKey, defaultValue)
    return OpenFeatureService.extractValue(details)
  }

  static getNumberValue(flagKey: string, defaultValue = 0): number {
    if (OpenFeatureService.initialized === false) {
      return defaultValue
    }

    const details = OpenFeature.getClient().getNumberDetails(flagKey, defaultValue)
    return OpenFeatureService.extractValue(details)
  }

  static getObjectValue<T extends JsonValue>(flagKey: string, defaultValue: T): T {
    if (OpenFeatureService.initialized === false) {
      return defaultValue
    }

    const details = OpenFeature.getClient().getObjectDetails<T>(flagKey, defaultValue)
    return OpenFeatureService.extractValue(details)
  }

  /**
   * Sets the authenticated user's email as the evaluation context, so ConfigCat
   * can target flags per-user (targeting rules, percentage rollouts).
   * @see https://configcat.com/docs/sdk-reference/openfeature/js/
   */
  static async setUserContext(email: string): Promise<void> {
    if (OpenFeatureService.initialized === false) {
      return
    }

    await OpenFeature.setContext({ targetingKey: email, email })
  }

  /** Clears the user evaluation context (e.g. on logout). */
  static async clearUserContext(): Promise<void> {
    if (OpenFeatureService.initialized === false) {
      return
    }

    await OpenFeature.clearContext()
  }

  /** @internal Resets state for testing purposes only. */
  static resetForTesting(): void {
    OpenFeatureService.initialized = false
  }

  /** Extracts the value from evaluation details and logs a trace on error. */
  private static extractValue<T extends FlagValue>(details: EvaluationDetails<T>): T {
    if (details.errorCode !== undefined) {
      logger.trace(`OpenFeature flag '${details.flagKey}' evaluation failed: ${details.errorMessage}`, details.errorCode)
    }

    return details.value
  }
}
