import type { RouteLocationNormalizedGeneric } from 'vue-router'
import { RouteName, Feature } from '@pulse/common/enums'
import { FeatureFlagManager } from '@pulse/common/managers'
import { getEffectiveIsMobile } from '@pulse/styleguide'
import { collaboratorWalletFoldersGuard } from './collaborator.wallet.guard'

const to = { name: RouteName.FOLDERS } as unknown as RouteLocationNormalizedGeneric

const setup = (options: { responsive: boolean, mobile: boolean, prospectExperience: boolean }) => {
  vi.spyOn(FeatureFlagManager, 'isResponsiveActivated').mockReturnValue(options.responsive)
  vi.mocked(getEffectiveIsMobile).mockReturnValue(options.mobile)
  vi.spyOn(FeatureFlagManager, 'isFeatureActivated').mockImplementation(
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
