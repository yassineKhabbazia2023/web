import { describe, it, expect, vi, afterEach } from 'vitest'
import useInitUserAuth from '@/composable/useInitUserAuth'
import { commonStore as store, tokenService } from '@kpmg/common'
import { givenToken } from '@/../vitest.setup'
import { getToken } from '@/services/msal'

const mockStorePatch = vi.fn()
const mockFechUserDataProvider = vi.fn(() => {
  return Promise.resolve({
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    isCollab: true,
  })
})
vi.mock('@kpmg/common', () => ({
  commonApi: () => vi.fn(),
  commonStore: () => ({
    $patch: mockStorePatch,
  }),
  dataProvider: () => ({
    fetchUserData: mockFechUserDataProvider,
  }),
  tokenService: {
    getToken: vi.fn().mockReturnValue('a-token'),
    setToken: vi.fn(),
  },
}))

vi.mock('@/composable/useStoreSubscription', () => ({
  default: () => ({
    subscribeToStoreUpdates: vi.fn(),
  }),
}))

describe('useInitUserAuth', () => {
  afterEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should init auth when the user is collab', async () => {
    const mockToken = 'mock-token'
    // Setup
    const setTokenSpy = vi.spyOn(tokenService, 'setToken')
    vi.spyOn(tokenService, 'getToken').mockReturnValue(mockToken)
    const { initAuthCollab, isTokenRetrieve } = useInitUserAuth()

    // Act
    await initAuthCollab()

    // Assert
    expect(getToken).toHaveBeenCalledWith()
    expect(isTokenRetrieve.value).toBeTruthy()
    expect(setTokenSpy).toHaveBeenCalledWith(givenToken)
    expect(mockStorePatch).toHaveBeenCalledTimes(1)
  })

  it('should init auth when user is client', async () => {
    const mockToken = 'mock-token'
    // Setup
    const setTokenSpy = vi.spyOn(tokenService, 'setToken')
    vi.spyOn(tokenService, 'getToken').mockReturnValue(mockToken)

    const { initAuthClient, isTokenRetrieve } = useInitUserAuth()

    // Act
    await initAuthClient()

    // Assert
    expect(getToken).not.toHaveBeenCalled()
    expect(isTokenRetrieve.value).toBeTruthy()
    expect(setTokenSpy).toHaveBeenCalledWith(mockToken)
    expect(store().$patch).toHaveBeenCalledTimes(1)
  })

  it('should not update state if the token is not present', async () => {
    // Setup
    const { initAuthClient, isTokenRetrieve } = useInitUserAuth()

    // Act
    await initAuthClient()

    // Assert
    expect(isTokenRetrieve.value).toBeFalsy()
    expect(store().$patch).not.toHaveBeenCalled()
  })

  it('should not set gigyaUserId given that the token is not available', () => {
    // Setup
    const mockGigyaUserId = 'gigya-user-id'

    const { setStoreGigyaUserId } = useInitUserAuth()

    // Act
    setStoreGigyaUserId(mockGigyaUserId)

    // Assert
    expect(store().$patch).toHaveBeenCalledTimes(0)
  })
})
