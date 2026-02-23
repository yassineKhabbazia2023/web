import { ref } from 'vue'
import type { OfferDescription, OfferCatalogReferent, OfferCatalogDocument, OfferWithSearchTerms } from '../../types/offers-catalog.types'
import { getOffersCatalog, getOfferCatalogPdf, getOfferCatalogDetails, getOffersRecommendations } from '../../services/offers-catalog.service'
import { normalizeSearchTerm, getOffersWithSearchTerms } from '../../utils/offers-catalog.utils'
import { logger } from '@pulse/toolbox'
import { filterRecordByKeyCallback } from '@pulse/toolbox/utils/array'
import { APICallStatus } from '@pulse/common/enums'
import { OffersCatalogTrackingManager } from '../../managers/offers-catalog-tracking/offers-catalog-tracking.manager'

export function useOffersCatalog() {
  const searchTerm = ref('')
  const offers = ref<OfferWithSearchTerms[]>([])
  const filteredOffers = ref<OfferDescription[]>([])
  const offer = ref<OfferDescription>()
  const offerReferents = ref<OfferCatalogReferent[]>()
  const offerDocuments = ref<OfferCatalogDocument[]>()
  const catalogDrawerIsOpened = ref(false)
  const pdfApiCallStatus = ref<APICallStatus>(APICallStatus.IDLE)
  const offerReferentsApiCallStatus = ref<APICallStatus>(APICallStatus.IDLE)
  const catalogApiCallStatus = ref<APICallStatus>(APICallStatus.IDLE)
  const aiSearchApiCallStatus = ref<APICallStatus>(APICallStatus.IDLE)
  const catalogDocumentViewerIsOpened = ref(false)
  const offerPdf = ref<Blob|string>('')
  const offerRecommendationsId = ref<string>('')
  const isSmartSearchEnabled = ref<boolean>(false)

  async function loadOffersCatalog() {
    catalogApiCallStatus.value = APICallStatus.LOADING
    try {
      const offersCatalog = await getOffersCatalog()
      offers.value = getOffersWithSearchTerms(offersCatalog.offers)
      catalogApiCallStatus.value = APICallStatus.SUCCESS
    } catch (e) {
      logger.error('Error while loading offersCatalog', e)
      catalogApiCallStatus.value = APICallStatus.ERROR
    }
  }

  function filterOffersCatalog() {
    const normalizedSearchTerm = normalizeSearchTerm(searchTerm.value)

    if (normalizedSearchTerm === '') {
      filteredOffers.value = offers.value
    } else {
      filteredOffers.value = offers.value
        .filter((offer) => filterRecordByKeyCallback(offer, 'searchTerms', normalizedSearchTerm))

      OffersCatalogTrackingManager.trackSearch(searchTerm.value, 'manual', 'succeeded')
    }
  }

  function setSelectedOffer(selectedOffer?: OfferDescription) {
    offer.value = selectedOffer
    catalogDrawerIsOpened.value = selectedOffer !== undefined
    offerPdf.value = ''
    offerReferents.value = undefined
    offerDocuments.value = undefined
  }

  async function loadOfferPdf() {
    pdfApiCallStatus.value = APICallStatus.LOADING
    offerPdf.value = ''
    try {
      const pdfUrl = offer.value?.pdfUrl ?? ''
      if (pdfUrl === '') {
        logger.warn('pdfUrl is empty')
        pdfApiCallStatus.value = APICallStatus.IDLE
        return
      }
      const pdf = await getOfferCatalogPdf(pdfUrl)
      offerPdf.value = new Blob([pdf], {
        type: 'application/pdf',
      })
      pdfApiCallStatus.value = APICallStatus.SUCCESS
    } catch (e) {
      logger.error('Error while loading offerPdf', e)
      pdfApiCallStatus.value = APICallStatus.ERROR
    }
  }

  async function loadOfferReferents() {
    offerReferentsApiCallStatus.value = APICallStatus.LOADING
    offerReferents.value = []
    offerDocuments.value = []
    try {
      if (offer.value?.id === undefined) {
        throw new Error('Unmanaged case, offer.id is undefined')
      }
      const offerDetails = await getOfferCatalogDetails(offer.value?.id)
      offerReferents.value = offerDetails.referents
      offerDocuments.value = offerDetails.attachments
      offerReferentsApiCallStatus.value = APICallStatus.SUCCESS
    } catch (e) {
      logger.error('Error while loading OfferCatalogDetails', e)
      offerReferentsApiCallStatus.value = APICallStatus.ERROR
    }
  }

  async function searchOffersWithAi(question: string) {
    isSmartSearchEnabled.value = true
    aiSearchApiCallStatus.value = APICallStatus.LOADING
    try {
      const response = await getOffersRecommendations(question)
      const offersById = new Map(offers.value.map((o) => [o.id, o]))
      offerRecommendationsId.value = response.id_offer_response

      filteredOffers.value = response.recommendations.flatMap(({ id, similarity_score }) => {
        const offer = offersById.get(Number(id))
        if (offer === undefined) {
          return []
        }
        return [{ ...offer, similarityScore: similarity_score }]
      })

      aiSearchApiCallStatus.value = APICallStatus.SUCCESS

      OffersCatalogTrackingManager.trackSearch(question, 'IA', 'succeeded')
    } catch (e) {
      logger.error('Error while searching offers with AI', e)
      aiSearchApiCallStatus.value = APICallStatus.ERROR

      OffersCatalogTrackingManager.trackSearch(question, 'IA', 'failed')
    }
  }

  function resetAiSearch() {
    isSmartSearchEnabled.value = false
    aiSearchApiCallStatus.value = APICallStatus.IDLE
  }

  return {
    searchTerm,
    filteredOffers,
    offer,
    offerPdf,
    offerReferents,
    offerDocuments,
    catalogDrawerIsOpened,
    pdfApiCallStatus,
    offerReferentsApiCallStatus,
    catalogApiCallStatus,
    aiSearchApiCallStatus,
    catalogDocumentViewerIsOpened,
    isSmartSearchEnabled,
    offerRecommendationsId,
    loadOffersCatalog,
    setSelectedOffer,
    loadOfferPdf,
    loadOfferReferents,
    filterOffersCatalog,
    searchOffersWithAi,
    resetAiSearch,
  }
}
