import { vi, describe, it, expect } from 'vitest'
import { getAssetsBaseUrl, setAssetsBaseUrl } from './imageResolverInit'

const baseCDNUrl = 'https://example.com'

const loggerDebugSpy = vi.hoisted(() => vi.fn())
const loggerWarnSpy = vi.hoisted(() => vi.fn())
const loggerErrorSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/core', () => ({
  logger: {
    debug: loggerDebugSpy,
    warn: loggerWarnSpy,
    error: loggerErrorSpy,
  },
}))

describe('test imageResolverInit', () => {
  it('getAssetsBaseUrl should return empty string when assetsBaseUrl is not initilized', () => {
    setAssetsBaseUrl('')
    const baseUrl = getAssetsBaseUrl()
    const warningMessage = 'should initialize AssetsBaseUrl with setAssetsBaseUrl()'
    expect(baseUrl).toBe('')
    expect(loggerWarnSpy).toHaveBeenCalledOnce()
    expect(loggerWarnSpy).toHaveBeenNthCalledWith(1, warningMessage)
  })
  it('getAssetsBaseUrl should return url given by setAssetsBaseUrl', () => {
    setAssetsBaseUrl(baseCDNUrl)
    const baseUrl = getAssetsBaseUrl()
    expect(baseUrl).equal(baseCDNUrl)
    expect(loggerWarnSpy).not.toHaveBeenCalled()
  })
})
