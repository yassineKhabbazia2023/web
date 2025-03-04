export const navigateToCustomerWalletMock = vi.fn()
export const navigateToWalletMock = vi.fn()

/**
 * As a useNavigation is a composable with a default export, use like this:
    vi.mock('@login/composable/useNavigation', () => ({
      default: () => useNavigationMock,
    }))
 */
export const useNavigationMock = {
  navigateToCustomerWallet: navigateToCustomerWalletMock,
  navigateToWallet: navigateToWalletMock,
}
