export const redirectToHomeMock = vi.fn()
export const logoutAndRedirectToLoginMock = vi.fn()

export const useRedirectionMock = {
  useRedirection: () => ({
    redirectToHome: redirectToHomeMock,
    logoutAndRedirectToLogin: logoutAndRedirectToLoginMock,
  }),
}
