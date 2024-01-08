import { describe, it, expect, vi, afterEach } from 'vitest'
import useInitUserAuth from '@/composable/useInitUserAuth'
import { commonStore as store } from '@kpmg/common'
import { getToken } from '@/services/msal'

vi.mock('@/services/msal', () => ({
  getToken: vi.fn(() => {
    return Promise.resolve('token')
  })
}))
const mockStorePatch = vi.fn()
const mockFechUserDataProvider = vi.fn(() => {
  return Promise.resolve({
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    isCollab: true
  })
})
vi.mock('@kpmg/common', () => ({
  commonApi: () => vi.fn(),
  commonStore: () => ({
    $patch: mockStorePatch
  }),
  dataProvider: () => ({
    fetchUserData: mockFechUserDataProvider
  })
}))

vi.mock('@/composable/useStoreSubscription', () => ({
  default: () => ({
    subscribeToStoreUpdates: vi.fn()
  })
}))

describe('useInitUserAuth', () => {
  afterEach(() => {
    sessionStorage.clear()
    vi.clearAllMocks()
  })

  it('should init auth when the user is collab', async () => {
    // Setup
    sessionStorage.setItem('token', 'mock-token')
    const { initAuthCollab, isTokenRetrieve } = useInitUserAuth()

    // Act
    await initAuthCollab()

    // Assert
    expect(getToken).toHaveBeenCalledWith()
    expect(isTokenRetrieve.value).toBeTruthy()
    expect(mockStorePatch).toHaveBeenCalledTimes(2)
  })

  it('should init auth when user is client', async () => {
    // Setup
    sessionStorage.setItem('token', 'mock-token')
    const { initAuthClient, isTokenRetrieve } = useInitUserAuth()

    // Act
    await initAuthClient()

    // Assert
    expect(getToken).not.toHaveBeenCalled()
    expect(isTokenRetrieve.value).toBeTruthy()
    expect(store().$patch).toHaveBeenCalledTimes(2)
  })

  it('should not update update state if the token is not present', async () => {
    // Setup
    const { initAuthClient, isTokenRetrieve } = useInitUserAuth()

    // Act
    await initAuthClient()

    // Assert
    expect(isTokenRetrieve.value).toBeFalsy()
    expect(store().$patch).not.toHaveBeenCalled()
  })

})
