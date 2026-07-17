import { useI18n } from 'vue-i18n'
import { useNavigationTracking } from './use-navigation-tracking.composable'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import type { NavigationItem } from '../types'
import { RouteName } from '@pulse/common/enums'

const mockT = vi.fn((key: string) => `translated_${key}`)

// vue-i18n's useI18n is spy-wrapped project-wide (doctrine: shared-hubs): arm the
// shared spy per test — the composable runs outside a component i18n context.
beforeEach(() => {
  vi.mocked(useI18n).mockReturnValue({ t: mockT } as unknown as ReturnType<typeof useI18n>)
})

describe('useNavigationTracking', () => {
  describe('trackNavigationFeature', () => {
    it('should track with featureName when defined', () => {
      const { trackNavigationFeature } = useNavigationTracking()

      const menuItem: NavigationItem = {
        routeName: RouteName.HOMEPAGE,
        title: 'shared.menu.dashboard',
        icon: 'house',
        featureName: 'dashboard',
        activeRoutes: [RouteName.HOMEPAGE],
      }

      trackNavigationFeature(menuItem)

      expect(AmplitudeService.track).toHaveBeenCalledWith('Feature Consulted', {
        feature_name: 'dashboard',
      })
    })

    it('should not track when doNotTrack is true', () => {
      const { trackNavigationFeature } = useNavigationTracking()

      const menuItem: NavigationItem = {
        routeName: RouteName.HOMEPAGE,
        title: 'shared.menu.dashboard',
        icon: 'house',
        featureName: 'dashboard',
        activeRoutes: [RouteName.HOMEPAGE],
        doNotTrack: true,
      }

      trackNavigationFeature(menuItem)

      expect(AmplitudeService.track).not.toHaveBeenCalled()
    })

    it('should track with translated title lowercase when featureName is undefined', () => {
      const { trackNavigationFeature } = useNavigationTracking()

      const menuItem: NavigationItem = {
        routeName: RouteName.HOMEPAGE,
        title: 'shared.menu.myTitle',
        icon: 'house',
        activeRoutes: [RouteName.HOMEPAGE],
      }

      trackNavigationFeature(menuItem)

      expect(mockT).toHaveBeenCalledWith('shared.menu.myTitle')
      expect(AmplitudeService.track).toHaveBeenCalledWith('Feature Consulted', {
        feature_name: 'translated_shared.menu.mytitle',
      })
    })
  })

})
