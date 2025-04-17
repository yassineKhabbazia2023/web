import useInitUserAuth from '@login/composable/useInitUserAuth'
import { useUserStore, useTokenStore } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks'

const userStoreMock = getStoreMock(useUserStore)
const tokenStoreMock = getStoreMock(useTokenStore)

const mockedMsalToken = 'msal-token'
const msalGetTokenSpy = vi.hoisted(() => vi.fn(() => mockedMsalToken))

vi.mock('@login/services/msal', () => ({
  getToken: msalGetTokenSpy,
}))

const userMock = {
  id: '123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  isCollab: true,
}

const mockFechUserDataProvider = vi.hoisted(() => vi.fn())
vi.mock('@pulse/common', () => ({
  commonApi: () => vi.fn(),
  dataProvider: () => ({
    fetchUserData: mockFechUserDataProvider,
  }),
  tokenService: {
    getToken: vi.fn().mockReturnValue('a-token'),
    setToken: vi.fn(),
  },
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
    tokenStoreMock.token = mockToken
    const { initAuthCollab, isTokenRetrieve } = useInitUserAuth()

    // Act
    await initAuthCollab()

    // Assert
    expect(msalGetTokenSpy).toHaveBeenCalledWith(/* nothing */)
    expect(isTokenRetrieve.value).toBeTruthy()
    expect(tokenStoreMock.setToken).toHaveBeenCalledWith(mockedMsalToken)
    expect(userStoreMock.setUser).toHaveBeenCalledOnce()
  })

  it('initAuthClient should NOT init auth when msal getToken returns empty token', async () => {
    // Setup
    msalGetTokenSpy.mockReturnValueOnce('')
    const { initAuthCollab, isTokenRetrieve } = useInitUserAuth()

    // Act
    await initAuthCollab()

    // Assert
    expect(msalGetTokenSpy).toHaveBeenCalledWith(/* nothing */)
    expect(isTokenRetrieve.value).toBeFalsy()
    expect(tokenStoreMock.setToken).not.toHaveBeenCalled()
    expect(userStoreMock.setUser).not.toHaveBeenCalled()
  })

  it('should init auth when user is client', async () => {
    mockFechUserDataProvider.mockResolvedValue(userMock)
    // Setup
    const { initAuthClient, isTokenRetrieve } = useInitUserAuth()

    // Act
    await initAuthClient()

    // Assert
    expect(msalGetTokenSpy).not.toHaveBeenCalled()
    expect(isTokenRetrieve.value).toBeTruthy()
    expect(tokenStoreMock.setToken).toHaveBeenCalledWith(mockToken)
    expect(userStoreMock.setUser).toHaveBeenCalledOnce()
    expect(userStoreMock.setUser).toHaveBeenCalledWith(userMock)
  })

  it('should not update state if the token is not present', async () => {
    // Setup
    tokenStoreMock.token = ''
    const { initAuthClient, isTokenRetrieve } = useInitUserAuth()

    // Act
    await initAuthClient()

    // Assert
    expect(isTokenRetrieve.value).toBeFalsy()
    expect(userStoreMock.setGigyaUserId).not.toHaveBeenCalled()
  })

  it('should not set gigyaUserId given that the token is not available', () => {
    // Setup
    tokenStoreMock.token = ''
    const mockGigyaUserId = 'gigya-user-id'

    const { setStoreGigyaUserId } = useInitUserAuth()

    // Act
    setStoreGigyaUserId(mockGigyaUserId)

    // Assert
    expect(userStoreMock.setGigyaUserId).not.toHaveBeenCalled()
  })

  it('should set gigyaUserId given that the token is available', () => {
    // Setup
    tokenStoreMock.token = mockToken
    const mockGigyaUserId = 'gigya-user-id'

    const { setStoreGigyaUserId } = useInitUserAuth()

    // Act
    setStoreGigyaUserId(mockGigyaUserId)

    // Assert
    expect(userStoreMock.setGigyaUserId).toHaveBeenCalledOnce()
    expect(userStoreMock.setGigyaUserId).toHaveBeenCalledWith(mockGigyaUserId)
  })
})
