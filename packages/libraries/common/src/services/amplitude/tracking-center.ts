import { AmplitudeEvent, AmplitudeFeatureName, AmplitudeFeatureLocalisation } from '@pulse/common/enums'
import { AmplitudeService } from './amplitude.service'

/**
 * High-level tracking helpers built on top of AmplitudeService.
 * Centralizes event names and properties to ensure consistency across the app.
 */
export class TrackingCenter {
  /**
   * Track homepage consultation event (Feature Consulted / homepage)
   */
  static trackHomepageConsulted(localisation?: AmplitudeFeatureLocalisation) {
    const properties: Record<string, string> = {
      feature_name: AmplitudeFeatureName.HOMEPAGE,
    }

    if (localisation !== undefined) {
      properties.feature_localisation_consultation = localisation
    }

    AmplitudeService.track(AmplitudeEvent.FEATURE_CONSULTED, properties)
  }
}
