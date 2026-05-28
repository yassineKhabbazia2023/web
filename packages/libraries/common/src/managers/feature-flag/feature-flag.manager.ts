import { Feature } from '../../enums/feature.enums'
import { OpenFeatureService } from '../../services/open-feature/open-feature.service'

export type EnvVars = Record<Feature, 'true' | 'false'>

// Features evaluated via OpenFeature/ConfigCat instead of environment variables.
// This list is internal to the manager and is meant to disappear once all flags are migrated.
const OPEN_FEATURE_FLAGS = new Set<Feature>([
  Feature.DELEGATION_REQUEST_TABS,
  Feature.PROSPECT_EXPERIENCE,
])

declare let window: {
  EnvVars: EnvVars
} & Window

export class FeatureFlagManager {
  static isMailToGedActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.MAIL_TO_GED)
  }

  static isGigyaSsoActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.GIGYA_SSO)
  }

  static isFeedCenterActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.FEED_CENTER)
  }

  static isMaintenanceModeActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.MAINTENANCE_MODE)
  }

  static isAmplitudeActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.AMPLITUDE)
  }

  static isClarityOfferActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.CLARITY_OFFER)
  }

  static isNotificationSettingsDrawerActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.NOTIFICATION_SETTINGS_DRAWER)
  }

  static isFeatureActivated(feature: Feature) {
    if (OPEN_FEATURE_FLAGS.has(feature) === true) {
      return OpenFeatureService.getBooleanValue(feature, false)
    }

    const value = window.EnvVars?.[feature]

    return value === 'true'
  }

  static isMailToPennylaneActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.MAIL_TO_PENNYLANE)
  }

  static isPennylaneSsoRedirectActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.PENNYLANE_SSO_REDIRECT)
  }

  static isResponsiveActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.RESPONSIVE)
  }

  static isPennylaneAmendmentFlowActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.PENNYLANE_AMENDMENT_FLOW)
  }

  static isSmartSearchOfferCatalogActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.SMART_SEARCH_OFFER_CATALOG)
  }

  static isModscreenV2Activated() {
    return FeatureFlagManager.isFeatureActivated(Feature.MODSCREEN_V2)
  }

  static isDelegationRequestTabsActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.DELEGATION_REQUEST_TABS)
  }
}
