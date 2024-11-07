import { beforeEach, vi, describe, it, expect, type MockInstance } from 'vitest'
import { imageResolver, getAssetsBaseUrl, setAssetsBaseUrl } from '@styleguide/utils/imageResolver'
import { logger } from '@styleguide/utils/logger'

const baseCDNUrl = 'https://example.com'

describe('imageResolver', () => {
  let loggerWarnSpy: MockInstance
  beforeEach(() => {
    loggerWarnSpy = vi.spyOn(logger, 'warn')
  })
  it('should correctly retrieve image url', () => {
    const imageType = 'dummy'
    const imageName = 'image'
    setAssetsBaseUrl(baseCDNUrl)
    const imageURl = imageResolver(imageType, imageName)
    const expectedResult = `${baseCDNUrl}/${imageType}/${imageName}.svg`
    expect(expectedResult).equal(imageURl)
    expect(loggerWarnSpy).not.toHaveBeenCalled()
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
