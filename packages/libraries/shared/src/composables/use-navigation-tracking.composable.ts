import { useI18n } from 'vue-i18n'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import type { NavigationItem } from '../types'

/**
 * Composable for tracking navigation events with Amplitude
 */
export const useNavigationTracking = () => {
  const { t } = useI18n({
    inheritLocale: true,
    useScope: 'global',
  })

  /**
   * Track navigation to a menu item feature
   * Uses featureName if defined, otherwise translates the title
   */
  const trackNavigationFeature = (menuItem: NavigationItem) => {
    const { featureName, title } = menuItem

    AmplitudeService.track('Feature Consulted', {
      feature_name: featureName ?? t(title).toLowerCase(),
    })
  }

  /**
   * Track a feature directly by name
   * Used for static navigation items that don't have a NavigationItem object
   */
  const trackFeature = (featureName: string) => {
    AmplitudeService.track('Feature Consulted', {
      feature_name: featureName,
    })
  }

  return {
    trackNavigationFeature,
    trackFeature,
  }
}
