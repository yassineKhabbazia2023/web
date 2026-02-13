import { loggerWarnSpy, loggerMock } from '@pulse/toolbox/mocks'

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

describe('test imageResolverInit', () => {
  let getAssetsBaseUrl: typeof import('./imageResolverInit').getAssetsBaseUrl
  let setAssetsBaseUrl: typeof import('./imageResolverInit').setAssetsBaseUrl

  beforeEach(async () => {
    vi.resetModules()
    vi.clearAllMocks()
    const mod = await import('./imageResolverInit')
    getAssetsBaseUrl = mod.getAssetsBaseUrl
    setAssetsBaseUrl = mod.setAssetsBaseUrl
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
