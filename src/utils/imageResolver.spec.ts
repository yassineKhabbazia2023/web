import { describe, it, expect } from 'vitest'
import { imageResolver } from '@/utils/imageResolver'
const baseCDNUrl = 'https://example.com'
const imageType = 'dummy'
const imageName = 'image'
const expectedResult = `${baseCDNUrl}/${imageType}/${imageName}.svg`

describe('imageResolver', () => {
  it('should correctly retrieve image url', () => {
    import.meta.env.VITE_CDN_URL = baseCDNUrl
    const imageURl = imageResolver(imageType, imageName)
    expect(expectedResult).equal(imageURl)
  })
})
