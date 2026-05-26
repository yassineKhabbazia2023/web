import { RouteName } from '@pulse/common/enums'
import { FeatureFlagManager } from '@pulse/common/managers'
import { getIsMobile } from '@pulse/styleguide'
import { collaboratorProfileGuard } from './collaborator.profile.guard'

vi.mock('@pulse/toolbox')
vi.mock('@pulse/common/managers')
vi.mock('@pulse/styleguide')

const to = { name: RouteName.PROFILE_INFORMATION } as any

const setup = (options: { responsive: boolean, mobile: boolean }) => {
  vi.mocked(FeatureFlagManager.isResponsiveActivated).mockReturnValue(options.responsive)
  vi.mocked(getIsMobile).mockReturnValue(options.mobile)
}

describe('collaboratorProfileGuard', () => {
  it('should not redirect when responsive and mobile are both activated', () => {
    setup({ responsive: true, mobile: true })

    expect(collaboratorProfileGuard(to)).toBeUndefined()
  })

  it.each([
    { responsive: false, mobile: true },
    { responsive: true, mobile: false },
    { responsive: false, mobile: false },
  ])('should redirect to landing when conditions are not all met (%o)', (options) => {
    setup(options)

    expect(collaboratorProfileGuard(to)).toEqual({ name: RouteName.LANDING })
  })
})
