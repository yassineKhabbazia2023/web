import { Feature } from '../enums/feature.enums'

export type EnvVars = Record<Feature, 'true' | 'false'>

declare let window: {
  EnvVars: EnvVars
} & Window

export class FeatureFlagManager {
  static isScheduleActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.SCHEDULE)
  }

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

  static isFeatureActivated(feature: Feature) {
    const value = window.EnvVars?.[feature]

    return value === 'true'
  }
}
