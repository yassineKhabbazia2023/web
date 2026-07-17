import { imageResolver } from './imageResolver'
import { getAssetsBaseUrl } from './imageResolverInit'

const baseCDNUrl = 'https://example.com'

beforeEach(() => {
  vi.mocked(getAssetsBaseUrl).mockReturnValue(baseCDNUrl)
})

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
