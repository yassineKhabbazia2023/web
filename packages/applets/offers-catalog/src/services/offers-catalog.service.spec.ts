import { getOffersCatalogResponseMock, getOfferMock, getOfferCatalogReferentListMock, getOffersRecommendationsResponseMock } from '../mocks/offers-catalog.service.mocks'
import { apiGatewayMock } from '@pulse/common/mocks/vitest'
import { API_PREFIXES } from '@pulse/common/constants'

import { getOffersCatalog, getOfferCatalogPdf, getOfferCatalogDetails, getOffersRecommendations, rateOfferRecommendation } from './offers-catalog.service'

const offersCatalogMock = getOffersCatalogResponseMock()

vi.mock('@pulse/common/api', () => ({
  api: ({
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

      expect(apiGatewayMock.get).toHaveBeenCalledExactlyOnceWith(expectedParameters)
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

      expect(apiGatewayMock.get).toHaveBeenCalledExactlyOnceWith(...expectedParameters)
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

      expect(apiGatewayMock.get).toHaveBeenCalledExactlyOnceWith(...expectedParameters)
      expect(offersCatalogDetails).toStrictEqual(offersCatalogDetailsMock)
    })
  })

  describe('getOffersRecommendations', () => {
    it('should call api properly', async () => {
      const recommendationsResponseMock = getOffersRecommendationsResponseMock()
      apiGatewayMock.post.mockResolvedValue({
        data: recommendationsResponseMock,
      })
      const questionMock = 'How to manage accounting?'

      const recommendations = await getOffersRecommendations(questionMock)
      const expectedUrl = `${API_PREFIXES.AI_SERVICES}/recommendations/offers`
      const expectedBody = { question: questionMock }

      expect(apiGatewayMock.post).toHaveBeenCalledExactlyOnceWith(expectedUrl, expectedBody)
      expect(recommendations).toStrictEqual(recommendationsResponseMock)
    })
  })

  describe('rateOfferResults', () => {
    it('should call api properly', async () => {
      apiGatewayMock.put.mockResolvedValue(null)
      const requestMock = {
        offer_id: 'id',
        type: 'offer',
        satisfaction: true,
        id_offer_response: 'idResponse',
      }

      await rateOfferRecommendation(requestMock)
      const expectedUrl = `${API_PREFIXES.AI_SERVICES}/recommendations/validation`

      expect(apiGatewayMock.put).toHaveBeenCalledExactlyOnceWith(expectedUrl, requestMock)
    })
  })
})
