import { Feature } from '../enums/feature.enums'

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

  static isAccessManagementGlobalActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.ACCESS_MANAGEMENT_GLOBAL)
  }

  static isHomepageWidgetsActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.HOMEPAGE_WIDGETS)
  }

  static isMaintenanceModeActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.MAINTENANCE_MODE)
  }

  static isAmplitudeActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.AMPLITUDE)
  }

  static isPennylaneActionAdditionalInfoActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.PENNYLANE_RIGHT_INFOS)
  }

  static isNotificationSettingsDrawerActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.NOTIFICATION_SETTINGS_DRAWER)
  }

  static isFeatureActivated(feature: Feature) {
    const value = window.EnvVars?.[feature]

    return value === 'true'
  }
}
