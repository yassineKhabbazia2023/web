import { TokenProviderService } from './token-provider.service'
import type { TokenProviderStrategy } from './token-provider.service.types'

const setTokenMock = vi.hoisted(() => vi.fn())
const getTokenMock = vi.hoisted(() => vi.fn().mockReturnValue('current-token'))
vi.mock('../../stores/token/token.store', () => ({
  useTokenStore: () => ({ setToken: setTokenMock, getToken: getTokenMock }),
}))

describe('TokenProviderService', () => {
  beforeEach(() => {
    TokenProviderService['strategy'] = undefined
    TokenProviderService['refreshPromise'] = undefined
    setTokenMock.mockClear()
    getTokenMock.mockClear()
    getTokenMock.mockReturnValue('current-token')
  })

  it('should throw when refreshToken is called without a registered strategy', async () => {
    await expect(TokenProviderService.refreshToken())
      .rejects.toThrow('TokenProviderService: no strategy registered')
  })

  it('should delegate refreshToken to the registered strategy', async () => {
    const refreshToken = vi.fn().mockResolvedValue('fresh-token')
    const strategy: TokenProviderStrategy = { refreshToken }

    TokenProviderService.registerProviderStrategy(strategy)
    const result = await TokenProviderService.refreshToken()

    expect(result).toBe('fresh-token')
    expect(refreshToken).toHaveBeenCalledOnce()
  })

  it('should coalesce concurrent refreshToken calls into a single strategy invocation', async () => {
    const refreshToken = vi.fn().mockResolvedValue('shared-token')
    TokenProviderService.registerProviderStrategy({ refreshToken })

    const [a, b] = await Promise.all([
      TokenProviderService.refreshToken(),
      TokenProviderService.refreshToken(),
    ])

    expect(a).toBe('shared-token')
    expect(b).toBe('shared-token')
    expect(refreshToken).toHaveBeenCalledOnce()
  })

  it('should clear refreshPromise after the strategy resolves', async () => {
    TokenProviderService.registerProviderStrategy({
      refreshToken: () => Promise.resolve('token'),
    })

    await TokenProviderService.refreshToken()

    expect(TokenProviderService.getRefreshPromise()).toBeUndefined()
  })

  it('should clear refreshPromise after the strategy rejects', async () => {
    TokenProviderService.registerProviderStrategy({
      refreshToken: () => Promise.reject(new Error('boom')),
    })

    await expect(TokenProviderService.refreshToken()).rejects.toThrow('boom')
    expect(TokenProviderService.getRefreshPromise()).toBeUndefined()
  })

  it('should expose the refresh promise while a refresh is in flight', async () => {
    let resolveRefresh: ((token: string) => void) | undefined
    TokenProviderService.registerProviderStrategy({
      refreshToken: () => new Promise<string>((resolve) => {
        resolveRefresh = resolve
      }),
    })

    const inFlight = TokenProviderService.refreshToken()
    expect(TokenProviderService.getRefreshPromise()).toBeInstanceOf(Promise)

    resolveRefresh!('done')
    await inFlight

    expect(TokenProviderService.getRefreshPromise()).toBeUndefined()
  })

  it('should persist the refreshed token to the store and only once for coalesced callers', async () => {
    const refreshToken = vi.fn().mockResolvedValue('fresh-token')
    TokenProviderService.registerProviderStrategy({ refreshToken })

    await Promise.all([
      TokenProviderService.refreshToken(),
      TokenProviderService.refreshToken(),
    ])

    expect(refreshToken).toHaveBeenCalledOnce()
    expect(setTokenMock).toHaveBeenCalledExactlyOnceWith('fresh-token')
  })

  it('should not persist anything when the strategy rejects', async () => {
    TokenProviderService.registerProviderStrategy({
      refreshToken: () => Promise.reject(new Error('boom')),
    })

    await expect(TokenProviderService.refreshToken()).rejects.toThrow('boom')
    expect(setTokenMock).not.toHaveBeenCalled()
  })

  it.each(['', null, undefined])(
    'should throw and not persist when the strategy returns %p',
    async (emptyValue) => {
      TokenProviderService.registerProviderStrategy({
        refreshToken: () => Promise.resolve(emptyValue as unknown as string),
      })

      await expect(TokenProviderService.refreshToken())
        .rejects.toThrow('TokenProviderService: strategy returned an empty token')
      expect(setTokenMock).not.toHaveBeenCalled()
    },
  )

  it('should reject and not persist when the store was cleared during the refresh', async () => {
    let resolveRefresh: ((token: string) => void) | undefined
    TokenProviderService.registerProviderStrategy({
      refreshToken: () => new Promise<string>((resolve) => {
        resolveRefresh = resolve
      }),
    })

    const inFlight = TokenProviderService.refreshToken()
    // Simulate a concurrent logout (or 401 callback) clearing the store while
    // the strategy is still in flight.
    getTokenMock.mockReturnValue('')
    resolveRefresh!('fresh-token')

    await expect(inFlight)
      .rejects.toThrow('TokenProviderService: token store was cleared during refresh')
    expect(setTokenMock).not.toHaveBeenCalled()
  })
})
