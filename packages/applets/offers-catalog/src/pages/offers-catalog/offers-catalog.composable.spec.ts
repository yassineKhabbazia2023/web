import type { OfferDescription } from '../../types/offers-catalog.types'
import { getOffersCatalogResponseMock } from '../../mocks/offers-catalog.service.mock'
import { loggerMock } from '@pulse/core/mocks'
import { APICallStatus } from '@pulse/common/enums'

import { useOffersCatalog } from './offers-catalog.composable'

const offersCatalogResponseMock = getOffersCatalogResponseMock()
const offerPdfMock = 'offer pdf mock'

const getOffersCatalogMock = vi.hoisted(() => vi.fn())
const getOfferCatalogPdfMock = vi.hoisted(() => vi.fn())

vi.mock('@pulse/core', () => ({
  logger: loggerMock,
}))

vi.mock('../../services/offers-catalog.service', () => ({
  getOffersCatalog: getOffersCatalogMock,
  getOfferCatalogPdf: getOfferCatalogPdfMock,
}))

describe('offers-catalog.composable', () => {
  describe('useOffersCatalog', () => {
    it('should initialize properly', () => {
      const expectedCards: OfferDescription[] = []
      const expectedOffer = undefined
      const expectedCatalogDrawerIsOpened = false

      const {
        offers,
        offer,
        catalogDrawerIsOpened,
      } = useOffersCatalog()

      expect(offers.value).toStrictEqual(expectedCards)
      expect(offer.value).toStrictEqual(expectedOffer)
      expect(catalogDrawerIsOpened.value).toStrictEqual(expectedCatalogDrawerIsOpened)
    })
  })

  describe('loadOffersCatalog', () => {
    it('should load offersCatalog properly', async () => {
      getOffersCatalogMock.mockResolvedValue(offersCatalogResponseMock)
      const expectedCards: OfferDescription[] = offersCatalogResponseMock.offers

      const {
        offers,
        loadOffersCatalog,
      } = useOffersCatalog()

      await loadOffersCatalog()

      expect(offers.value).toStrictEqual(expectedCards)
      expect(loggerMock.error).not.toHaveBeenCalled()
    })

    it('should call logger.error when getOffersCatalog fails', async () => {
      const errorMock = 'error mock'
      getOffersCatalogMock.mockRejectedValue(errorMock)
      const expectedParameters = [
        'Error while loading offersCatalog',
        errorMock,
      ]
      const expectedCards: OfferDescription[] = []

      const {
        offers,
        loadOffersCatalog,
      } = useOffersCatalog()

      await loadOffersCatalog()

      expect(offers.value).toStrictEqual(expectedCards)
      expect(loggerMock.error).toHaveBeenCalledOnce()
      expect(loggerMock.error).toHaveBeenCalledWith(...expectedParameters)
    })
  })

  describe('setSelectedOffer', () => {
    const tests = [{
      selectedOffer: offersCatalogResponseMock.offers[0],
      expectedCatalogDrawerIsOpened: true,
      reason: 'selected offer is defined',
    }, {
      selectedOffer: undefined,
      expectedCatalogDrawerIsOpened: false,
      reason: 'selected offer is undefined',
    }]
    it.each(tests)('should load set offer and drawerIsOpened properly when $reason', ({
      selectedOffer,
      expectedCatalogDrawerIsOpened,
    }) => {
      const expectedOffer = selectedOffer
      const {
        offer,
        catalogDrawerIsOpened,
        setSelectedOffer,
      } = useOffersCatalog()

      setSelectedOffer(selectedOffer)

      expect(offer.value).toStrictEqual(expectedOffer)
      expect(catalogDrawerIsOpened.value).toStrictEqual(expectedCatalogDrawerIsOpened)
    })
  })

  describe('loadOfferPdf', () => {
    it('should load pdf when pdfUrl is given', async () => {
      getOfferCatalogPdfMock.mockResolvedValue(offerPdfMock)
      const expectedofferPdf = new Blob([offerPdfMock], {
        type: 'application/pdf',
      })
      const selectedOfferMock = offersCatalogResponseMock.offers[0]
      const expectedParameters = [selectedOfferMock.pdfUrl]

      const {
        offerPdf,
        pdfLoadingStatus,
        setSelectedOffer,
        loadOfferPdf,
      } = useOffersCatalog()

      setSelectedOffer(selectedOfferMock)
      await loadOfferPdf()

      expect(offerPdf.value).toStrictEqual(expectedofferPdf)

      expect(getOfferCatalogPdfMock).toHaveBeenCalledOnce()
      expect(getOfferCatalogPdfMock).toHaveBeenCalledWith(...expectedParameters)
      expect(loggerMock.error).not.toHaveBeenCalled()
      expect(pdfLoadingStatus.value).toBe(APICallStatus.SUCCESS)
    })

    it('should not load pdf when pdfUrl is empty', async () => {
      getOfferCatalogPdfMock.mockResolvedValue(offerPdfMock)
      const expectedofferPdf = ''
      const selectedOfferMock = offersCatalogResponseMock.offers[0]
      const expectedLoggerWarnMessage = 'pdfUrl is empty'

      const {
        offerPdf,
        pdfLoadingStatus,
        setSelectedOffer,
        loadOfferPdf,
      } = useOffersCatalog()

      setSelectedOffer({
        ...selectedOfferMock,
        pdfUrl: '',
      })
      await loadOfferPdf()

      expect(offerPdf.value).toStrictEqual(expectedofferPdf)

      expect(getOfferCatalogPdfMock).not.toHaveBeenCalled()
      expect(loggerMock.warn).toHaveBeenCalledOnce()
      expect(loggerMock.warn).toHaveBeenCalledWith(expectedLoggerWarnMessage)
      expect(pdfLoadingStatus.value).toBe(APICallStatus.IDLE)
    })

    it('should call logger.error when api call fails', async () => {
      const errorMock = 'error mock'
      const expectedofferPdf = ''
      const expectedParameters = [
        'Error while loading offerPdf',
        errorMock,
      ]
      getOfferCatalogPdfMock.mockRejectedValue(errorMock)

      const selectedOfferMock = offersCatalogResponseMock.offers[0]
      const {
        offerPdf,
        setSelectedOffer,
        loadOfferPdf,
      } = useOffersCatalog()

      setSelectedOffer(selectedOfferMock)
      await loadOfferPdf()

      expect(offerPdf.value).toStrictEqual(expectedofferPdf)

      expect(loggerMock.error).toHaveBeenCalledOnce()
      expect(loggerMock.error).toHaveBeenCalledWith(...expectedParameters)
    })
  })
})
