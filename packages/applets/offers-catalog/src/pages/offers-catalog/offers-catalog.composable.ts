import { ref } from 'vue'
import type { OfferDescription } from '../../types/offers-catalog.types'
import { getOffersCatalog, getOfferCatalogPdf } from '../../services/offers-catalog.service'
import { logger } from '@pulse/core'
import { APICallStatus } from '@pulse/common/enums'

export function useOffersCatalog() {
  const offers = ref<OfferDescription[]>([])
  const offer = ref<OfferDescription>()
  const catalogDrawerIsOpened = ref(false)
  const pdfLoadingStatus = ref<APICallStatus>(APICallStatus.IDLE)
  const catalogLoadingStatus = ref<APICallStatus>(APICallStatus.IDLE)
  const catalogDocumentViewerIsOpened = ref(false)
  const offerPdf = ref<Blob|string>('')

  async function loadOffersCatalog() {
    catalogLoadingStatus.value = APICallStatus.LOADING
    try {
      const offersCatalog = await getOffersCatalog()
      offers.value = offersCatalog.offers
      catalogLoadingStatus.value = APICallStatus.SUCCESS
    } catch (e) {
      logger.error('Error while loading offersCatalog', e)
      catalogLoadingStatus.value = APICallStatus.ERROR
    }
  }

  function setSelectedOffer(selectedOffer?: OfferDescription) {
    offer.value = selectedOffer
    catalogDrawerIsOpened.value = selectedOffer !== undefined
  }

  async function loadOfferPdf() {
    pdfLoadingStatus.value = APICallStatus.LOADING
    offerPdf.value = ''
    try {
      const pdfUrl = offer.value?.pdfUrl ?? ''
      if (pdfUrl === '') {
        logger.warn('pdfUrl is empty')
        pdfLoadingStatus.value = APICallStatus.IDLE
        return
      }
      const pdf = await getOfferCatalogPdf(pdfUrl)
      offerPdf.value = new Blob([pdf], {
        type: 'application/pdf',
      })
      pdfLoadingStatus.value = APICallStatus.SUCCESS
    } catch (e) {
      logger.error('Error while loading offerPdf', e)
      pdfLoadingStatus.value = APICallStatus.ERROR
    }
  }

  return {
    offers,
    offer,
    offerPdf,
    catalogDrawerIsOpened,
    pdfLoadingStatus,
    catalogLoadingStatus,
    catalogDocumentViewerIsOpened,
    loadOffersCatalog,
    setSelectedOffer,
    loadOfferPdf,
  }
}
