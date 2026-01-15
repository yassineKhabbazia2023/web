import { Feature } from '../../enums/feature.enums'

export type EnvVars = Record<Feature, 'true' | 'false'>

declare let window: {
  EnvVars: EnvVars
} & Window

export class FeatureFlagManager {
  static isMailToGedActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.MAIL_TO_GED)
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

  static isCustomerBookingActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.CUSTOMER_BOOKING)
  }

  static isFeatureActivated(feature: Feature) {
    const value = window.EnvVars?.[feature]

    return value === 'true'
  }

  static isMailToPennylaneActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.MAIL_TO_PENNYLANE)
  }

  static isPennylaneSsoRedirectActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.PENNYLANE_SSO_REDIRECT)
  }
}
