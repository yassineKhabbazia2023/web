import { RouteName, Feature } from '@pulse/common/enums'
import { FeatureFlagManager } from '@pulse/common/managers'
import { getIsMobile } from '@pulse/styleguide'
import { collaboratorWalletFoldersGuard } from './collaborator.wallet.guard'

vi.mock('@pulse/toolbox')
vi.mock('@pulse/common/managers')
vi.mock('@pulse/styleguide')

const to = { name: RouteName.FOLDERS } as any

const setup = (options: { responsive: boolean, mobile: boolean, prospectExperience: boolean }) => {
  vi.mocked(FeatureFlagManager.isResponsiveActivated).mockReturnValue(options.responsive)
  vi.mocked(getIsMobile).mockReturnValue(options.mobile)
  vi.mocked(FeatureFlagManager.isFeatureActivated).mockImplementation(
    (feature) => feature === Feature.PROSPECT_EXPERIENCE && options.prospectExperience,
  )
}

describe('collaboratorWalletFoldersGuard', () => {
  it('should redirect to prospects when responsive, mobile and prospect experience are all activated', () => {
    setup({ responsive: true, mobile: true, prospectExperience: true })

    expect(collaboratorWalletFoldersGuard(to)).toEqual({ name: RouteName.PROSPECTS })
  })

  it.each([
    { responsive: false, mobile: true, prospectExperience: true },
    { responsive: true, mobile: false, prospectExperience: true },
    { responsive: true, mobile: true, prospectExperience: false },
  ])('should not redirect when conditions are not all met (%o)', (options) => {
    setup(options)

    expect(collaboratorWalletFoldersGuard(to)).toBeUndefined()
  })
})
