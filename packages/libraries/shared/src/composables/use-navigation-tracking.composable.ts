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
    if (menuItem.doNotTrack === true) {
      return
    }

    const { featureName, title } = menuItem

    AmplitudeService.track('Feature Consulted', {
      feature_name: featureName ?? t(title).toLowerCase(),
    })
  }

  return {
    trackNavigationFeature,
  }
}
