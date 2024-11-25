import { beforeEach, vi, describe, it, expect, type MockInstance } from 'vitest'
import { getAssetsBaseUrl, setAssetsBaseUrl } from './imageResolverInit'

const baseCDNUrl = 'https://example.com'

describe('test imageResolverInit', () => {
  let loggerWarnSpy: MockInstance
  beforeEach(() => {
    loggerWarnSpy = vi.spyOn(console, 'warn')
  })
  it('getAssetsBaseUrl should return empty string when assetsBaseUrl is not initilized', () => {
    setAssetsBaseUrl('')
    const baseUrl = getAssetsBaseUrl()
    const warningMessage = 'should initialize AssetsBaseUrl with setAssetsBaseUrl()'
    expect(baseUrl).toBe('')
    expect(loggerWarnSpy).toHaveBeenNthCalledWith(1, warningMessage)
  })
  it('getAssetsBaseUrl should return url given by setAssetsBaseUrl', () => {
    setAssetsBaseUrl(baseCDNUrl)
    const baseUrl = getAssetsBaseUrl()
    expect(baseUrl).equal(baseCDNUrl)
    expect(loggerWarnSpy).not.toHaveBeenCalled()
  })
})
