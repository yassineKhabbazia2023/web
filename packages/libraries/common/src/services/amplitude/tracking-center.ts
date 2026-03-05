import { AmplitudeEvent, AmplitudeFeatureName } from '@pulse/common/enums'
import { AmplitudeService } from './amplitude.service'

/**
 * High-level tracking helpers built on top of AmplitudeService.
 * Centralizes event names and properties to ensure consistency across the app.
 */
export class TrackingCenter {
  /**
   * Track homepage consultation event (Feature Consulted / homepage)
   */
  static trackHomepageConsulted() {
    AmplitudeService.track(AmplitudeEvent.FEATURE_CONSULTED, {
      feature_name: AmplitudeFeatureName.HOMEPAGE,
    })
  }
}
