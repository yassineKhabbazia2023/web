import type { OfferDescription } from '../../types/offers-catalog.types'
import { getOffersCatalogResponseMock, getOfferCatalogDetailsResponseMock, getOfferCatalogReferentListMock, getOffersRecommendationsResponseMock } from '../../mocks/offers-catalog.service.mocks'
import { loggerMock } from '@pulse/toolbox/mocks'
import { OffersCatalogTrackingManager } from '../../managers/offers-catalog-tracking/offers-catalog-tracking.manager'
import { APICallStatus } from '@pulse/common/enums'
import { getOffersWithSearchTerms } from '../../utils/offers-catalog.utils'
import { filterRecordByKeyCallback } from '@pulse/toolbox/utils/array'
import { getOffersCatalog, getOfferCatalogPdf, getOfferCatalogDetails, getOffersRecommendations } from '../../services/offers-catalog.service'

import { useOffersCatalog } from './offers-catalog.composable'

const offersCatalogResponseMock = getOffersCatalogResponseMock()
// The runtime string stands in for the ArrayBuffer: the composable only feeds
// it to new Blob(), which accepts both.
const offerPdfMock = 'offer pdf mock' as unknown as ArrayBuffer
const offerDetailsMock = getOfferCatalogDetailsResponseMock()
const referentsMock = getOfferCatalogReferentListMock()

const getOffersCatalogMock = vi.mocked(getOffersCatalog)
const getOfferCatalogPdfMock = vi.mocked(getOfferCatalogPdf)
const getOfferCatalogDetailsMock = vi.mocked(getOfferCatalogDetails)
const getOffersRecommendationsMock = vi.mocked(getOffersRecommendations)

describe('offers-catalog.composable', () => {
  beforeEach(() => {
    vi.spyOn(OffersCatalogTrackingManager, 'trackSearch').mockImplementation(() => undefined)
  })

  describe('useOffersCatalog', () => {
    it('should initialize properly', () => {
      const expectedCards: OfferDescription[] = []
      const expectedOffer = undefined
      const expectedCatalogDrawerIsOpened = false

      const {
        filteredOffers,
        offer,
        catalogDrawerIsOpened,
      } = useOffersCatalog()

      expect(filteredOffers.value).toStrictEqual(expectedCards)
      expect(offer.value).toStrictEqual(expectedOffer)
      expect(catalogDrawerIsOpened.value).toStrictEqual(expectedCatalogDrawerIsOpened)
    })
  })

  describe('loadOffersCatalog', () => {
    it('should filter offers properly when no search term', async () => {
      getOffersCatalogMock.mockResolvedValue(offersCatalogResponseMock)
      const expectedCards: OfferDescription[] = getOffersWithSearchTerms(offersCatalogResponseMock.offers)

      const {
        filteredOffers,
        loadOffersCatalog,
        filterOffersCatalog,
      } = useOffersCatalog()

      await loadOffersCatalog()
      filterOffersCatalog()

      expect(filteredOffers.value).toStrictEqual(expectedCards)
      expect(loggerMock.error).not.toHaveBeenCalled()
      expect(vi.mocked(OffersCatalogTrackingManager.trackSearch)).not.toHaveBeenCalled()
    })

    it('should filter offers properly when any search term', async () => {
      getOffersCatalogMock.mockResolvedValue(offersCatalogResponseMock)
      const firstOffer = offersCatalogResponseMock.offers[0]
      const expectedOffers: OfferDescription[] = getOffersWithSearchTerms([firstOffer])

      const {
        searchTerm,
        filteredOffers,
        loadOffersCatalog,
        filterOffersCatalog,
      } = useOffersCatalog()

      searchTerm.value = 'Gérer sa comptabilité'

      const filterRecordByKeyCallbackMock = vi
        .mocked(filterRecordByKeyCallback)
        .mockImplementation((offer) => `${offer.id}` === `${firstOffer.id}`) // should compare strings

      await loadOffersCatalog()
      filterOffersCatalog()

      expect(filteredOffers.value).toStrictEqual(expectedOffers)
      expect(loggerMock.error).not.toHaveBeenCalled()
      expect(filterRecordByKeyCallbackMock).toHaveBeenCalledTimes(offersCatalogResponseMock.offers.length)
      expect(vi.mocked(OffersCatalogTrackingManager.trackSearch)).toHaveBeenCalledExactlyOnceWith(
        'Gérer sa comptabilité',
        'manual',
        'succeeded',
      )
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
        filteredOffers,
        loadOffersCatalog,
      } = useOffersCatalog()

      await loadOffersCatalog()

      expect(filteredOffers.value).toStrictEqual(expectedCards)
      expect(loggerMock.error).toHaveBeenCalledExactlyOnceWith(...expectedParameters)
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
        pdfApiCallStatus,
        setSelectedOffer,
        loadOfferPdf,
      } = useOffersCatalog()

      setSelectedOffer(selectedOfferMock)
      await loadOfferPdf()

      expect(offerPdf.value).toStrictEqual(expectedofferPdf)

      expect(getOfferCatalogPdfMock).toHaveBeenCalledExactlyOnceWith(...expectedParameters)
      expect(loggerMock.error).not.toHaveBeenCalled()
      expect(pdfApiCallStatus.value).toBe(APICallStatus.SUCCESS)
    })

    it('should not load pdf when pdfUrl is empty', async () => {
      getOfferCatalogPdfMock.mockResolvedValue(offerPdfMock)
      const expectedofferPdf = ''
      const selectedOfferMock = offersCatalogResponseMock.offers[0]
      const expectedLoggerWarnMessage = 'pdfUrl is empty'

      const {
        offerPdf,
        pdfApiCallStatus,
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
      expect(loggerMock.warn).toHaveBeenCalledExactlyOnceWith(expectedLoggerWarnMessage)
      expect(pdfApiCallStatus.value).toBe(APICallStatus.IDLE)
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

      expect(loggerMock.error).toHaveBeenCalledExactlyOnceWith(...expectedParameters)
    })
  })

  describe('loadOfferReferents', () => {
    it('should load referents when selected offer is given', async () => {
      const offerDetailsWithReferentsMock = {
        ...offerDetailsMock,
        referents: referentsMock,
      }
      getOfferCatalogDetailsMock.mockResolvedValue(offerDetailsWithReferentsMock)
      const selectedOfferMock = offersCatalogResponseMock.offers[0]
      const expectedParameters = [selectedOfferMock.id]

      const {
        offerReferents,
        offerReferentsApiCallStatus,
        setSelectedOffer,
        loadOfferReferents,
      } = useOffersCatalog()

      setSelectedOffer(selectedOfferMock)
      await loadOfferReferents()

      expect(offerReferents.value).toStrictEqual(referentsMock)

      expect(getOfferCatalogDetailsMock).toHaveBeenCalledExactlyOnceWith(...expectedParameters)
      expect(loggerMock.error).not.toHaveBeenCalled()
      expect(offerReferentsApiCallStatus.value).toBe(APICallStatus.SUCCESS)
    })

    it('should not load referents when selected offer is undefined', async () => {
      const expectedLoggerErrorMessage = 'Error while loading OfferCatalogDetails'
      const expectedErrorMessage = 'Unmanaged case, offer.id is undefined'

      const {
        offerReferents,
        pdfApiCallStatus,
        setSelectedOffer,
        loadOfferReferents,
      } = useOffersCatalog()

      setSelectedOffer()
      await loadOfferReferents()

      expect(offerReferents.value).toHaveLength(0)

      expect(getOfferCatalogDetailsMock).not.toHaveBeenCalled()
      expect(loggerMock.error).toHaveBeenCalledExactlyOnceWith(expectedLoggerErrorMessage, new Error(expectedErrorMessage))
      expect(pdfApiCallStatus.value).toBe(APICallStatus.IDLE)
    })

    it('should call logger.error when api call fails', async () => {
      const errorMock = 'error mock'
      const expectedParameters = [
        'Error while loading OfferCatalogDetails',
        errorMock,
      ]
      getOfferCatalogDetailsMock.mockRejectedValue(errorMock)

      const selectedOfferMock = offersCatalogResponseMock.offers[0]
      const {
        offerReferents,
        setSelectedOffer,
        loadOfferReferents,
      } = useOffersCatalog()

      setSelectedOffer(selectedOfferMock)
      await loadOfferReferents()

      expect(offerReferents.value).toHaveLength(0)

      expect(loggerMock.error).toHaveBeenCalledExactlyOnceWith(...expectedParameters)
    })
  })

  describe('searchOffersWithAi', () => {
    it('should filter offers with similarity scores when api call succeeds', async () => {
      const recommendationsResponseMock = getOffersRecommendationsResponseMock()
      getOffersCatalogMock.mockResolvedValue(offersCatalogResponseMock)
      getOffersRecommendationsMock.mockResolvedValue(recommendationsResponseMock)

      const {
        filteredOffers,
        aiSearchApiCallStatus,
        isSmartSearchEnabled,
        loadOffersCatalog,
        searchOffersWithAi,
      } = useOffersCatalog()

      const searchTerm = 'How to manage accounting?'

      await loadOffersCatalog()
      await searchOffersWithAi(searchTerm)

      expect(aiSearchApiCallStatus.value).toBe(APICallStatus.SUCCESS)
      expect(filteredOffers.value.length).toBeGreaterThan(0)
      expect(filteredOffers.value[0].similarityScore).toBeDefined()
      expect(loggerMock.error).not.toHaveBeenCalled()
      expect(isSmartSearchEnabled.value).toBe(true)
      expect(vi.mocked(OffersCatalogTrackingManager.trackSearch)).toHaveBeenCalledExactlyOnceWith(
        searchTerm,
        'IA',
        'succeeded',
      )
    })

    it('should call logger.error when api call fails', async () => {
      const errorMock = 'error mock'
      getOffersCatalogMock.mockResolvedValue(offersCatalogResponseMock)
      getOffersRecommendationsMock.mockRejectedValue(errorMock)

      const {
        aiSearchApiCallStatus,
        loadOffersCatalog,
        searchOffersWithAi,
      } = useOffersCatalog()

      const searchTerm = 'How to manage accounting?'

      await loadOffersCatalog()
      await searchOffersWithAi(searchTerm)

      expect(aiSearchApiCallStatus.value).toBe(APICallStatus.ERROR)
      expect(loggerMock.error).toHaveBeenCalledExactlyOnceWith('Error while searching offers with AI', errorMock)
      expect(vi.mocked(OffersCatalogTrackingManager.trackSearch)).toHaveBeenCalledExactlyOnceWith(
        searchTerm,
        'IA',
        'failed',
      )
    })
  })

  describe('resetAiSearch', () => {
    it('should reset aiSearchApiCallStatus to IDLE', async () => {
      const recommendationsResponseMock = getOffersRecommendationsResponseMock()
      getOffersCatalogMock.mockResolvedValue(offersCatalogResponseMock)
      getOffersRecommendationsMock.mockResolvedValue(recommendationsResponseMock)

      const {
        aiSearchApiCallStatus,
        isSmartSearchEnabled,
        loadOffersCatalog,
        searchOffersWithAi,
        resetAiSearch,
      } = useOffersCatalog()

      await loadOffersCatalog()
      await searchOffersWithAi('test question')

      expect(aiSearchApiCallStatus.value).toBe(APICallStatus.SUCCESS)

      resetAiSearch()

      expect(aiSearchApiCallStatus.value).toBe(APICallStatus.IDLE)
      expect(isSmartSearchEnabled.value).toBe(false)
    })
  })
})
