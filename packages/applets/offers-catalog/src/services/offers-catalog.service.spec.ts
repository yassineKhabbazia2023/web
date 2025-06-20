import { getOffersCatalogResponseMock, getOfferMock, getOfferCatalogReferentListMock } from '../mocks/offers-catalog.service.mocks'
import { apiGatewayMock } from '@pulse/common/mocks'
import { API_PREFIXES } from '@pulse/common/constants'

import { getOffersCatalog, getOfferCatalogPdf, getOfferCatalogDetails } from './offers-catalog.service'

const offersCatalogMock = getOffersCatalogResponseMock()

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: apiGatewayMock,
  }),
}))

describe('offers-catalog.service', () => {
  describe('getOffersCatalog', () => {
    it('should call api properly', async () => {
      apiGatewayMock.get.mockResolvedValue({
        data: offersCatalogMock,
      })

      const offersCatalog = await getOffersCatalog()
      const expectedParameters = `${API_PREFIXES.OFFER}/catalog/offers`

      expect(apiGatewayMock.get).toHaveBeenCalledOnce()
      expect(apiGatewayMock.get).toHaveBeenCalledWith(expectedParameters)
      expect(offersCatalog).toStrictEqual(offersCatalogMock)
    })
  })

  describe('getOfferCatalogPdf', () => {
    it('should call api properly', async () => {
      const offerCatalogPdfMock = new ArrayBuffer(8) // Mocking an ArrayBuffer for the PDF response
      apiGatewayMock.get.mockResolvedValue({
        data: offerCatalogPdfMock,
      })

      const fileNameMock = 'file name mock'
      const offersCatalogPdf = await getOfferCatalogPdf(fileNameMock)
      const expectedParameters = [
        `${API_PREFIXES.OFFER}/catalog/${fileNameMock}`,
        {
          responseType: 'arraybuffer',
        },
      ]

      expect(apiGatewayMock.get).toHaveBeenCalledOnce()
      expect(apiGatewayMock.get).toHaveBeenCalledWith(...expectedParameters)
      expect(offersCatalogPdf).toStrictEqual(offerCatalogPdfMock)
    })
  })

  describe('getOfferCatalogDetails', () => {
    it('should call api properly', async () => {
      const offerCatalogMock = getOfferMock()
      const referentsMock = getOfferCatalogReferentListMock()
      const offersCatalogDetailsMock = {
        ...offerCatalogMock,
        referents: referentsMock,
      }
      apiGatewayMock.get.mockResolvedValue({
        data: offersCatalogDetailsMock,
      })
      const offerIdMock = offersCatalogDetailsMock.id

      const offersCatalogDetails = await getOfferCatalogDetails(offerIdMock)
      const expectedParameters = [
        `${API_PREFIXES.OFFER}/catalog/offers/${offerIdMock}`,
      ]

      expect(apiGatewayMock.get).toHaveBeenCalledOnce()
      expect(apiGatewayMock.get).toHaveBeenCalledWith(...expectedParameters)
      expect(offersCatalogDetails).toStrictEqual(offersCatalogDetailsMock)
    })
  })
})
