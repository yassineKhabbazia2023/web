import type { RouteLocationNormalizedGeneric } from 'vue-router'
import { RouteName } from '@pulse/common/enums'
import { FeatureFlagManager } from '@pulse/common/managers'
import { customerProfileGuard } from './customer.profile.guard'

const mockGetIsMobile = vi.hoisted(() => vi.fn())

vi.mock('@pulse/common/managers')
vi.mock('@pulse/styleguide', () => ({
  getIsMobile: mockGetIsMobile,
}))

describe('customerProfileGuard', () => {
  const accessTests = [
    {
      reason: 'should redirect to landing when responsive is not activated',
      isResponsive: false,
      isMobile: true,
      routeName: RouteName.PROFILE_INFORMATION,
      expectedRedirect: RouteName.LANDING,
    },
    {
      reason: 'should redirect to landing when not on mobile',
      isResponsive: true,
      isMobile: false,
      routeName: RouteName.PROFILE_INFORMATION,
      expectedRedirect: RouteName.LANDING,
    },
    {
      reason: 'should allow access to profile information on mobile with responsive activated',
      isResponsive: true,
      isMobile: true,
      routeName: RouteName.PROFILE_INFORMATION,
      expectedRedirect: undefined,
    },
  ]

  it.each(accessTests)('$reason', ({ isResponsive, isMobile, routeName, expectedRedirect }) => {
    vi.mocked(FeatureFlagManager.isResponsiveActivated).mockReturnValue(isResponsive)
    mockGetIsMobile.mockReturnValue(isMobile)

    const toRoute = { name: routeName } as unknown as RouteLocationNormalizedGeneric
    const result = customerProfileGuard(toRoute)

    if (expectedRedirect) {
      expect(result).toEqual({ name: expectedRedirect })
    } else {
      expect(result).toBeUndefined()
    }
  })
})
