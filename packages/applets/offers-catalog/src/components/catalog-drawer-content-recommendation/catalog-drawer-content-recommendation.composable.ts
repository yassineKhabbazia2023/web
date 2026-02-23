import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { displayNotification } from '@pulse/styleguide'
import { logger } from '@pulse/toolbox'
import { getSalesPitch, rateOfferRecommendation } from '../../services/offers-catalog.service'
import { OfferEvaluationType, SalesPitchSection } from '../../services/offers-catalog.service.enum'
import { OffersCatalogTrackingManager } from '../../managers/offers-catalog-tracking/offers-catalog-tracking.manager'

export function useCatalogDrawerContentRecommendation(offerId: number, offerResponseId: string) {
  const { t } = useI18n({
    inheritLocale: true,
    useScope: 'local',
  })

  const isLoadingReason = ref(false)
  const hasErrorReason = ref(false)
  const reasonResponse = ref('')

  const isLoadingSale = ref(false)
  const hasErrorSale = ref(false)
  const saleResponse = ref('')

  const isReasonRated = ref<boolean | null>(null)
  const isSaleRated = ref<boolean | null>(null)

  async function onGenerateReason() {
    isLoadingReason.value = true
    hasErrorReason.value = false
    try {
      const response = await getSalesPitch(
        offerResponseId,
        String(offerId),
        SalesPitchSection.REASON,
      )
      reasonResponse.value = response.reason
      OffersCatalogTrackingManager.trackExplicationResult('succeeded')
    } catch (error) {
      logger.error('Failed to generate reason', error)
      hasErrorReason.value = true
      OffersCatalogTrackingManager.trackExplicationResult('failed')
    } finally {
      isLoadingReason.value = false
    }
  }

  async function onGenerateSale() {
    isLoadingSale.value = true
    hasErrorSale.value = false
    try {
      const response = await getSalesPitch(
        offerResponseId,
        String(offerId),
        SalesPitchSection.SALE,
      )
      saleResponse.value = response.sale
      OffersCatalogTrackingManager.trackSaleResult('succeeded')
    } catch (error) {
      logger.error('Failed to generate sale argument', error)
      hasErrorSale.value = true
      OffersCatalogTrackingManager.trackSaleResult('failed')
    } finally {
      isLoadingSale.value = false
    }
  }

  async function onCopyReasonToClipboard() {
    if (reasonResponse.value === '') {
      return
    }
    try {
      await navigator.clipboard.writeText(reasonResponse.value)
      displayNotification('success', t('copySuccess'))
    } catch (error) {
      logger.error('Failed to copy to clipboard', error)
    }
  }

  async function onCopySaleToClipboard() {
    if (saleResponse.value === '') {
      return
    }
    try {
      await navigator.clipboard.writeText(saleResponse.value)
      displayNotification('success', t('copySuccess'))
    } catch (error) {
      logger.error('Failed to copy to clipboard', error)
    }
  }

  async function submitRating(satisfaction: boolean, type: OfferEvaluationType): Promise<boolean> {
    const request = {
      offer_id: String(offerId),
      type,
      satisfaction,
      id_offer_response: offerResponseId,
    }

    try {
      await rateOfferRecommendation(request)
      return true
    } catch (error) {
      logger.error(`Error while rating ${type} response`, error)
      return false
    }
  }

  async function handleReasonRating(satisfaction: boolean) {
    if (isReasonRated.value !== null) {
      return
    }
    const success = await submitRating(satisfaction, OfferEvaluationType.REASON)
    if (success === true) {
      isReasonRated.value = satisfaction
      OffersCatalogTrackingManager.trackEvaluation(satisfaction === true ? 'good' : 'bad', 'reason')
    }
  }

  async function handleSaleRating(satisfaction: boolean) {
    if (isSaleRated.value !== null) {
      return
    }
    const success = await submitRating(satisfaction, OfferEvaluationType.SALE)
    if (success === true) {
      isSaleRated.value = satisfaction
      OffersCatalogTrackingManager.trackEvaluation(satisfaction === true ? 'good' : 'bad', 'sale')
    }
  }

  return {
    isLoadingReason,
    hasErrorReason,
    reasonResponse,
    isLoadingSale,
    hasErrorSale,
    saleResponse,
    isReasonRated,
    isSaleRated,
    onGenerateReason,
    onGenerateSale,
    onCopyReasonToClipboard,
    onCopySaleToClipboard,
    handleReasonRating,
    handleSaleRating,
  }
}
