import { beforeEach, vi, describe, it, expect, type SpyInstance } from 'vitest'
import { imageResolver, getAssetsBaseUrl, setAssetsBaseUrl } from '@/utils/imageResolver'
const baseCDNUrl = 'https://example.com'

describe('imageResolver', () => {
  let consoleWarnSpy: SpyInstance
  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn')
  })
  it('should correctly retrieve image url', () => {
    const imageType = 'dummy'
    const imageName = 'image'
    setAssetsBaseUrl(baseCDNUrl)
    const imageURl = imageResolver(imageType, imageName)
    const expectedResult = `${baseCDNUrl}/${imageType}/${imageName}.svg`
    expect(expectedResult).equal(imageURl)
    expect(consoleWarnSpy).not.toHaveBeenCalled()
  })
  it('getAssetsBaseUrl should return empty string when assetsBaseUrl is not initilized', () => {
    setAssetsBaseUrl('')
    const baseUrl = getAssetsBaseUrl()
    const warningMessage = 'should initialize AssetsBaseUrl with setAssetsBaseUrl()'
    expect(baseUrl).toBe('')
    expect(consoleWarnSpy).toHaveBeenNthCalledWith(1, warningMessage)
  })
  it('getAssetsBaseUrl should return url given by setAssetsBaseUrl', () => {
    setAssetsBaseUrl(baseCDNUrl)
    const baseUrl = getAssetsBaseUrl()
    expect(baseUrl).equal(baseCDNUrl)
    expect(consoleWarnSpy).not.toHaveBeenCalled()
  })
})
