import { ref } from 'vue'
import type { OfferDescription, OfferCatalogReferent, OfferWithSearchTerms } from '../../types/offers-catalog.types'
import { getOffersCatalog, getOfferCatalogPdf, getOfferCatalogDetails } from '../../services/offers-catalog.service'
import { normalizeSearchTerm, getOffersWithSearchTerms } from '../../utils/offers-catalog.utils'
import { logger } from '@pulse/core'
import { filterRecordByKeyCallback } from '@pulse/core/utils/array'
import { APICallStatus } from '@pulse/common/enums'

export function useOffersCatalog() {
  const searchTerm = ref('')
  const offers = ref<OfferWithSearchTerms[]>([])
  const filteredOffers = ref<OfferDescription[]>([])
  const offer = ref<OfferDescription>()
  const offerReferents = ref<OfferCatalogReferent[]>()
  const catalogDrawerIsOpened = ref(false)
  const pdfApiCallStatus = ref<APICallStatus>(APICallStatus.IDLE)
  const offerReferentsApiCallStatus = ref<APICallStatus>(APICallStatus.IDLE)
  const catalogApiCallStatus = ref<APICallStatus>(APICallStatus.IDLE)
  const catalogDocumentViewerIsOpened = ref(false)
  const offerPdf = ref<Blob|string>('')

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
    }
  }

  function setSelectedOffer(selectedOffer?: OfferDescription) {
    offer.value = selectedOffer
    catalogDrawerIsOpened.value = selectedOffer !== undefined
    offerPdf.value = ''
    offerReferents.value = undefined
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
    try {
      if (offer.value?.id === undefined) {
        throw new Error('Unmanaged case, offer.id is undefined')
      }
      const offerDetails = await getOfferCatalogDetails(offer.value?.id)
      offerReferents.value = offerDetails.referents
      offerReferentsApiCallStatus.value = APICallStatus.SUCCESS
    } catch (e) {
      logger.error('Error while loading OfferCatalogDetails', e)
      offerReferentsApiCallStatus.value = APICallStatus.ERROR
    }
  }

  return {
    searchTerm,
    filteredOffers,
    offer,
    offerPdf,
    offerReferents,
    catalogDrawerIsOpened,
    pdfApiCallStatus,
    offerReferentsApiCallStatus,
    catalogApiCallStatus,
    catalogDocumentViewerIsOpened,
    loadOffersCatalog,
    setSelectedOffer,
    loadOfferPdf,
    loadOfferReferents,
    filterOffersCatalog,
  }
}
