import { getOffersCatalogResponseMock } from '../mocks/offers-catalog.service.mock'
import { apiGatewayMock } from '@pulse/common/mocks'
import { API_PREFIXES } from '@pulse/common/constants'

import { getOffersCatalog } from './offers-catalog.service'

const offersCatalogMock = getOffersCatalogResponseMock()

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: apiGatewayMock,
  }),
}))

describe('offers-catalog.service', () => {
  beforeEach(() => {
    apiGatewayMock.get.mockResolvedValue({
      data: offersCatalogMock,
    })
  })

  it('should call api properly', async () => {
    const offersCatalog = await getOffersCatalog()
    const expectedParameters = `${API_PREFIXES.OFFER}/catalog/offers`

    expect(apiGatewayMock.get).toHaveBeenCalledOnce()
    expect(apiGatewayMock.get).toHaveBeenCalledWith(expectedParameters)
    expect(offersCatalog).toStrictEqual(offersCatalogMock)
  })
})
