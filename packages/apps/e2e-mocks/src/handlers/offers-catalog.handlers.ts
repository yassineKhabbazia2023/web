import { http, HttpResponse } from 'msw'
import {
  getOffersCatalogResponseMock,
  getOfferCatalogDetailsResponseMock,
  getOfferCatalogReferentListMock,
  getOfferCatalogDocumentListMock,
  getOffersMock,
} from '@pulse/offers-catalog/mocks'

function getOfferCatalogDetails(offerId: number) {
  const offers = getOffersMock()
  const offer = offers.find((o) => o.id === offerId)

  return getOfferCatalogDetailsResponseMock({
    ...offer,
    referents: getOfferCatalogReferentListMock(),
    attachments: getOfferCatalogDocumentListMock(),
  })
}

export const offersCatalogHandlers = [
  http.get('*/offer/api/catalog/offers', () => {
    return HttpResponse.json(getOffersCatalogResponseMock())
  }),

  http.get('*/offer/api/catalog/offers/:offerId', ({ params }) => {
    const offerId = Number(params.offerId)
    return HttpResponse.json(getOfferCatalogDetails(offerId))
  }),

  http.get('*/offer/api/catalog/:fileName', async () => {
    const pdfResponse = await fetch('/assets/sample.pdf')
    const pdfBuffer = await pdfResponse.arrayBuffer()
    return new HttpResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
      },
    })
  }),
]
