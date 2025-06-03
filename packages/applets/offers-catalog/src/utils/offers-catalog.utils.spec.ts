import { DEFAULT_TAG_STYLE, CATALOG_TAG_STYLES } from '../const/offers-catalog.const'
import { loggerMock } from '@pulse/core/mocks'

import { getCatalogTagStyle } from './offers-catalog.utils'

vi.mock('@pulse/core', () => ({
  logger: loggerMock,
}))

describe('offers-catalog.utils', () => {
  it('should return proper style when tag label is known', () => {
    const tagLabel = CATALOG_TAG_STYLES[0].tagLabel
    const expectedCatalogTagStyle = CATALOG_TAG_STYLES[0].tagStyle

    const catalogTagStyle = getCatalogTagStyle(tagLabel)

    expect(loggerMock.error).not.toHaveBeenCalled()
    expect(catalogTagStyle).toBe(expectedCatalogTagStyle)
  })

  it('should return default style when tag label is unknown', () => {
    const tagLabel = 'unknown'
    const catalogTagStyle = getCatalogTagStyle(tagLabel)

    const expectedCatalogTagStyle = DEFAULT_TAG_STYLE
    const expectedParameters = `style not found for label '${tagLabel}'`

    expect(loggerMock.error).toHaveBeenCalledOnce()
    expect(loggerMock.error).toHaveBeenCalledWith(expectedParameters)
    expect(catalogTagStyle).toBe(expectedCatalogTagStyle)
  })
})
