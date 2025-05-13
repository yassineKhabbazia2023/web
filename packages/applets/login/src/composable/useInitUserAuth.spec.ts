import useInitUserAuth from '@login/composable/useInitUserAuth'
import { useUserStore, useTokenStore } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks'
import { TokenManager } from '@pulse/common/managers'

const userStoreMock = getStoreMock(useUserStore)
const tokenStoreMock = getStoreMock(useTokenStore)

const mockedMsalToken = 'msal-token'
const msalGetTokenSpy = vi.hoisted(() => vi.fn(() => mockedMsalToken))

vi.mock('@login/services/msal', () => ({
  getMSALToken: msalGetTokenSpy,
}))

const userMock = {
  id: '123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  isCollab: true,
}

const mockFetchUserDataProvider = vi.hoisted(() => vi.fn())
vi.mock('@pulse/common', () => ({
  commonApi: () => vi.fn(),
  dataProvider: () => ({
    fetchUserData: mockFetchUserDataProvider,
  }),
}))

vi.mock('@login/composable/useStoreSubscription', () => ({
  default: () => ({
    subscribeToStoreUpdates: vi.fn(),
  }),
}))

const mockToken = 'mock-token'

describe('useInitUserAuth', () => {
  afterEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should init auth when the user is collab', async () => {
    // Setup
    const { initAuthCollab, isTokenRetrieve } = useInitUserAuth()

    // Act
    await initAuthCollab()

    // Assert
    expect(msalGetTokenSpy).toHaveBeenCalledWith(/* nothing */)
    expect(isTokenRetrieve.value).toBeTruthy()
    expect(tokenStoreMock.setTokenExpiration).toHaveBeenCalledWith(mockedMsalToken)
    expect(userStoreMock.setUser).toHaveBeenCalledOnce()
  })

  it('initAuthCollab should NOT init auth when msal getToken returns empty token', async () => {
    // Setup
    msalGetTokenSpy.mockReturnValueOnce('')
    const { initAuthCollab, isTokenRetrieve } = useInitUserAuth()

    // Act
    await initAuthCollab()

    // Assert
    expect(msalGetTokenSpy).toHaveBeenCalledWith(/* nothing */)
    expect(isTokenRetrieve.value).toBeFalsy()
    expect(userStoreMock.setUser).not.toHaveBeenCalled()
  })

  it('should init auth when user is client', async () => {
    // Setup
    mockFetchUserDataProvider.mockResolvedValue(userMock)
    vi.spyOn(TokenManager, 'getToken').mockReturnValue(mockToken)
    const { initAuthClient, isTokenRetrieve } = useInitUserAuth()

    // Act
    await initAuthClient()

    // Assert
    expect(msalGetTokenSpy).not.toHaveBeenCalled()
    expect(isTokenRetrieve.value).toBeTruthy()
    expect(userStoreMock.setUser).toHaveBeenCalledOnce()
    expect(userStoreMock.setUser).toHaveBeenCalledWith(userMock)
  })

  it('should not update state if the token is not present', async () => {
    // Setup
    const { initAuthClient, isTokenRetrieve } = useInitUserAuth()

    // Act
    await initAuthClient()

    // Assert
    expect(isTokenRetrieve.value).toBeFalsy()
    expect(userStoreMock.setGigyaUserId).not.toHaveBeenCalled()
  })

  it('should not set gigyaUserId given that the token is not available', () => {
    // Setup
    const mockGigyaUserId = 'gigya-user-id'

    const { setStoreGigyaUserId } = useInitUserAuth()

    // Act
    setStoreGigyaUserId(mockGigyaUserId)

    // Assert
    expect(userStoreMock.setGigyaUserId).not.toHaveBeenCalled()
  })

  it('should set gigyaUserId given that the token is available', () => {
    // Setup
    vi.spyOn(TokenManager, 'getToken').mockReturnValue(mockToken)
    const mockGigyaUserId = 'gigya-user-id'

    const { setStoreGigyaUserId } = useInitUserAuth()

    // Act
    setStoreGigyaUserId(mockGigyaUserId)

    // Assert
    expect(userStoreMock.setGigyaUserId).toHaveBeenCalledOnce()
    expect(userStoreMock.setGigyaUserId).toHaveBeenCalledWith(mockGigyaUserId)
  })
})
