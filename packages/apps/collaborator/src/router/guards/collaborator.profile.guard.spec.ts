import type { RouteLocationNormalizedGeneric } from 'vue-router'
import { RouteName } from '@pulse/common/enums'
import { getEffectiveIsMobile } from '@pulse/styleguide'
import { collaboratorProfileGuard } from './collaborator.profile.guard'

const to = { name: RouteName.PROFILE_INFORMATION } as unknown as RouteLocationNormalizedGeneric

describe('collaboratorProfileGuard', () => {
  it('should not redirect when user is on mobile', () => {
    vi.mocked(getEffectiveIsMobile).mockReturnValue(true)

    expect(collaboratorProfileGuard(to)).toBeUndefined()
  })

  it('should redirect to landing when user is not on mobile', () => {
    vi.mocked(getEffectiveIsMobile).mockReturnValue(false)

    expect(collaboratorProfileGuard(to)).toEqual({ name: RouteName.LANDING })
  })
})
