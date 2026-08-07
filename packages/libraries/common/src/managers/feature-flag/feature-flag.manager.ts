import { Feature } from '../../enums/feature.enums'
import { OpenFeatureService } from '../../services/open-feature/open-feature.service'

export type EnvVars = Record<Feature, 'true' | 'false'>

// Features evaluated via OpenFeature/ConfigCat instead of environment variables.
// This list is internal to the manager and is meant to disappear once all flags are migrated.
const OPEN_FEATURE_FLAGS = new Set<Feature>([
  Feature.DELEGATION_REQUEST_TABS,
  Feature.FAVORITE_SORT,
  Feature.INVOICES_EXPERIENCE,
  Feature.LAST_ACTIVITY_FEATURE,
  Feature.MANAGE_WALLET_MENU,
  Feature.PROSPECT_EXPERIENCE,
  Feature.WALLET_TABLE_LOAD_MORE_PAGINATION,
  Feature.WALLET_V2,
])

declare let window: {
  EnvVars: EnvVars
} & Window

export class FeatureFlagManager {
  static isAmplitudeActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.AMPLITUDE)
  }

  static isClarityOfferActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.CLARITY_OFFER)
  }

  static isDelegationRequestTabsActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.DELEGATION_REQUEST_TABS)
  }

  static isFavoriteSortActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.FAVORITE_SORT)
  }

  static isFeatureActivated(feature: Feature) {
    if (OPEN_FEATURE_FLAGS.has(feature) === true) {
      return OpenFeatureService.getBooleanValue(feature, false)
    }

    const value = window.EnvVars?.[feature]

    return value === 'true'
  }

  static isGigyaSsoActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.GIGYA_SSO)
  }

  static isLastActivityFeatureActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.LAST_ACTIVITY_FEATURE)
  }

  static isMaintenanceModeActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.MAINTENANCE_MODE)
  }

  static isManageWalletMenuActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.MANAGE_WALLET_MENU)
  }

  static isModscreenV2Activated() {
    return FeatureFlagManager.isFeatureActivated(Feature.MODSCREEN_V2)
  }

  static isPennylaneAmendmentFlowActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.PENNYLANE_AMENDMENT_FLOW)
  }

  static isSeresInvoicesActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.INVOICES_EXPERIENCE)
  }

  static isSmartSearchOfferCatalogActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.SMART_SEARCH_OFFER_CATALOG)
  }

  static isWalletTableLoadMorePaginationActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.WALLET_TABLE_LOAD_MORE_PAGINATION)
  }

  static isWalletV2Activated() {
    return FeatureFlagManager.isFeatureActivated(Feature.WALLET_V2)
  }
}
