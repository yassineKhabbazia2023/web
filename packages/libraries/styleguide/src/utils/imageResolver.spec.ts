import { vi, describe, it, expect } from 'vitest'
import { imageResolver } from './imageResolver'

const baseCDNUrl = 'https://example.com'

vi.mock('./imageResolverInit', () => ({
  getAssetsBaseUrl: () => baseCDNUrl,
}))

describe('imageResolver', () => {
  it('should correctly retrieve image url', () => {
    const imageType = 'dummy'
    const imageName = 'image'
    const fileName = `${imageName}.svg`
    const imagePath = `${imageType}/${fileName}`
    const imageList = {
      [imageName]: imagePath,
    }
    const imageURl = imageResolver(imageName, imageList)
    const expectedResult = `${baseCDNUrl}/${imagePath}`
    expect(expectedResult).equal(imageURl)
  })
})
