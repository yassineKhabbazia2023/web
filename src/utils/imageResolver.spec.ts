import { describe, it, expect } from 'vitest'
import { imageResolver, getAssetsBaseUrl, setAssetsBaseUrl } from '@/utils/imageResolver'
const baseCDNUrl = 'https://example.com'

describe('imageResolver', () => {
  it('should correctly retrieve image url', () => {
    const imageType = 'dummy'
    const imageName = 'image'
    setAssetsBaseUrl(baseCDNUrl)
    const imageURl = imageResolver(imageType, imageName)
    const expectedResult = `${baseCDNUrl}/${imageType}/${imageName}.svg`
    expect(expectedResult).equal(imageURl)
  })
  it('getAssetsBaseUrl should return empty string when assetsBaseUrl is not initilized', () => {
    setAssetsBaseUrl('')
    const baseUrl = getAssetsBaseUrl()
    expect(baseUrl).toBe('')
  })
  it('getAssetsBaseUrl should return url given by setAssetsBaseUrl', () => {
    setAssetsBaseUrl(baseCDNUrl)
    const baseUrl = getAssetsBaseUrl()
    expect(baseUrl).equal(baseCDNUrl)
  })
})
