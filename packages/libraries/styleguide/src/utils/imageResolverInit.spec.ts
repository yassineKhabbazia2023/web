import { loggerWarnSpy } from '@pulse/toolbox/mocks'
import { getAssetsBaseUrl, setAssetsBaseUrl } from './imageResolverInit'
import { TEST_ASSETS_BASE_URL } from '../__mocks__/test-assets.constants'

// The module is spy-wrapped and memoized per worker (vi.resetModules() cannot
// produce a fresh instance), so the shared state is reset through its own API.
describe('test imageResolverInit', () => {
  beforeEach(() => {
    setAssetsBaseUrl('')
  })

  afterEach(() => {
    // Restore the base URL every other spec of the worker relies on.
    setAssetsBaseUrl(TEST_ASSETS_BASE_URL)
  })

  it('getAssetsBaseUrl should return empty string when assetsBaseUrl is not initialized', () => {
    const baseUrl = getAssetsBaseUrl()
    const warningMessage = 'should initialize AssetsBaseUrl with setAssetsBaseUrl()'
    expect(baseUrl).toBe('')
    expect(loggerWarnSpy).toHaveBeenCalledOnce()
    expect(loggerWarnSpy).toHaveBeenNthCalledWith(1, warningMessage)
  })

  it('getAssetsBaseUrl should return url given by setAssetsBaseUrl', () => {
    setAssetsBaseUrl('https://example.com')
    const baseUrl = getAssetsBaseUrl()
    expect(baseUrl).equal('https://example.com')
    expect(loggerWarnSpy).not.toHaveBeenCalled()
  })
})
