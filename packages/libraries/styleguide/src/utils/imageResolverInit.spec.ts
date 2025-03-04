import { vi, describe, it, expect } from 'vitest'
import { loggerWarnSpy, loggerMock } from '@pulse/core/mocks'

import { getAssetsBaseUrl, setAssetsBaseUrl } from './imageResolverInit'

const baseCDNUrl = 'https://example.com'

vi.mock('@pulse/core', () => ({ logger: loggerMock }))

describe('test imageResolverInit', () => {
  it('getAssetsBaseUrl should return empty string when assetsBaseUrl is not initialized', () => {
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
