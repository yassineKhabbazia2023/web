import { CurrentUserManager } from '@pulse/common/managers'
import { RouteName } from '@pulse/common/enums'
import { CustomerLandingManager } from '@customer/managers/customer-landing.manager'
import { customerWalletGuard } from './customer.wallet.guard'

describe('customerWalletGuard', () => {
  it('should load the user context before redirecting the wallet root to its default tab', async () => {
    const defaultWalletTab = { name: RouteName.CUSTOMER_PROSPECTS }
    const ensureUserContextSpy = vi.spyOn(CurrentUserManager, 'ensureUserContext').mockResolvedValue()
    const getWalletDefaultTabSpy = vi.spyOn(CustomerLandingManager, 'getWalletDefaultTab')
      .mockReturnValue(defaultWalletTab)

    const result = await customerWalletGuard({ name: RouteName.WALLET } as never)

    expect(ensureUserContextSpy).toHaveBeenCalledOnce()
    expect(getWalletDefaultTabSpy).toHaveBeenCalledOnce()
    expect(ensureUserContextSpy.mock.invocationCallOrder[0])
      .toBeLessThan(getWalletDefaultTabSpy.mock.invocationCallOrder[0])
    expect(result).toEqual(defaultWalletTab)
  })

  it('should ignore routes other than the wallet root', async () => {
    const ensureUserContextSpy = vi.spyOn(CurrentUserManager, 'ensureUserContext').mockResolvedValue()
    const getWalletDefaultTabSpy = vi.spyOn(CustomerLandingManager, 'getWalletDefaultTab')

    const result = await customerWalletGuard({ name: RouteName.CUSTOMER_ENTITIES } as never)

    expect(ensureUserContextSpy).not.toHaveBeenCalled()
    expect(getWalletDefaultTabSpy).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
  })
})
