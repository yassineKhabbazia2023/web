export const initAuthClientMock = vi.fn()
export const initAuthCollabMock = vi.fn()
export const setStoreGigyaUserIdMock = vi.fn()
export const isTokenRetrieveTrueMock = { value: true }
export const isTokenRetrieveFalseMock = { value: false }

/**
 * As a useInitUserAuth is a composable with a default export, use like this:
    vi.mock('@login/composable/useInitUserAuth', () => ({
      default: () => useInitUserAuthMock,
    }))
 */
export const useInitUserAuthMock = {
  initAuthClient: initAuthClientMock,
  initAuthCollab: initAuthCollabMock,
  setStoreGigyaUserId: setStoreGigyaUserIdMock,
  isTokenRetrieve: isTokenRetrieveTrueMock,
}
