import type { RouteLocationNormalizedGeneric } from 'vue-router'
import { RouteName } from '@pulse/common/enums'
import { getEffectiveIsMobile } from '@pulse/styleguide'
import { customerProfileGuard } from './customer.profile.guard'

describe('customerProfileGuard', () => {
  const accessTests = [
    {
      reason: 'should redirect to landing when not on mobile',
      isMobile: false,
      routeName: RouteName.PROFILE_INFORMATION,
      expectedRedirect: RouteName.LANDING,
    },
    {
      reason: 'should allow access to profile information on mobile',
      isMobile: true,
      routeName: RouteName.PROFILE_INFORMATION,
      expectedRedirect: undefined,
    },
  ]

  it.each(accessTests)('$reason', ({ isMobile, routeName, expectedRedirect }) => {
    vi.mocked(getEffectiveIsMobile).mockReturnValue(isMobile)

    const toRoute = { name: routeName } as unknown as RouteLocationNormalizedGeneric
    const result = customerProfileGuard(toRoute)

    if (expectedRedirect) {
      expect(result).toEqual({ name: expectedRedirect })
    } else {
      expect(result).toBeUndefined()
    }
  })
})
