import { beforeEach, vi, describe, it, expect, type MockInstance } from 'vitest'
import { imageResolver } from './imageResolver'

const baseCDNUrl = 'https://example.com'

vi.mock('./imageResolverInit', () => ({
  getAssetsBaseUrl: () => baseCDNUrl,
}))

describe('imageResolver', () => {
  let loggerWarnSpy: MockInstance
  beforeEach(() => {
    loggerWarnSpy = vi.spyOn(console, 'warn')
  })
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
    expect(loggerWarnSpy).not.toHaveBeenCalled()
  })
})
