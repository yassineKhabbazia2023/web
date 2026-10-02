import { Feature } from '../../enums/feature.enums'
import { OpenFeatureService } from '../../services/open-feature/open-feature.service'

export type EnvVars = Record<Feature, 'true' | 'false'>

// Features evaluated via OpenFeature/ConfigCat instead of environment variables.
// This list is internal to the manager and is meant to disappear once all flags are migrated.
const OPEN_FEATURE_FLAGS = new Set<Feature>([
  Feature.DEMAT_MAIL_COLLECT,
  Feature.ELECTRONIC_ADDRESS_AVAILABLE,
  Feature.HUBSPOT_PRODUCT_FRUITS,
  Feature.INVOICES_EXPERIENCE,
  Feature.KEY_MOMENTS,
  Feature.LEGACY_VENTYA_INVOICES_ACCESS,
  Feature.MAINTENANCE_MODE,
  Feature.MONTHLY_NOTE,
  Feature.PENNYLANE_SSO_FORCE_PROXY,
  Feature.PROSPECT_EXPERIENCE,
  Feature.SERENITY_REDIRECTION_MODAL,
  Feature.RFINANCE,
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

  static isDematMailCollectActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.DEMAT_MAIL_COLLECT)
  }

  static isElectronicAddressAvailable() {
    return FeatureFlagManager.isFeatureActivated(Feature.ELECTRONIC_ADDRESS_AVAILABLE)
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

  static isHubspotProductFruitsActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.HUBSPOT_PRODUCT_FRUITS)
  }

  static isKeyMomentsActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.KEY_MOMENTS)
  }

  static isLegacyVentyaInvoicesAccessActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.LEGACY_VENTYA_INVOICES_ACCESS)
  }

  static isMaintenanceModeActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.MAINTENANCE_MODE)
  }

  static isMonthlyNoteActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.MONTHLY_NOTE)
  }

  static isModscreenV2Activated() {
    return FeatureFlagManager.isFeatureActivated(Feature.MODSCREEN_V2)
  }

  static isPennylaneAmendmentFlowActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.PENNYLANE_AMENDMENT_FLOW)
  }

  static isPennylaneSsoForceProxyActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.PENNYLANE_SSO_FORCE_PROXY)
  }

  static isRFinanceActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.RFINANCE)
  }

  static isSerenityRedirectionModalActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.SERENITY_REDIRECTION_MODAL)
  }

  static isSeresInvoicesActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.INVOICES_EXPERIENCE)
  }

  static isSmartSearchOfferCatalogActivated() {
    return FeatureFlagManager.isFeatureActivated(Feature.SMART_SEARCH_OFFER_CATALOG)
  }
}
