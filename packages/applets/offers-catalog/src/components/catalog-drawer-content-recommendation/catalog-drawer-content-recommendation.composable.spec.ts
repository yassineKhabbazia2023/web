import { getSalesPitch, rateOfferRecommendation } from '../../services/offers-catalog.service'
import { OffersCatalogTrackingManager } from '../../managers/offers-catalog-tracking/offers-catalog-tracking.manager'
import { useCatalogDrawerContentRecommendation } from './catalog-drawer-content-recommendation.composable'
import { displayNotification } from '@pulse/styleguide'
import { withSetup } from '@pulse/toolbox/utils/test'

const mockClipboard = {
  writeText: vi.fn(),
}

const OFFER_ID = 123
const ID_OFFER_RESPONSE = 'response-456'

describe('useCatalogDrawerContentRecommendation', () => {
  beforeEach(() => {
    vi.mocked(displayNotification).mockImplementation(() => undefined)
    // jsdom has no clipboard: stub the whole navigator for the test
    // (unstubGlobals restores the real one after each test).
    vi.stubGlobal('navigator', { clipboard: mockClipboard })
    vi.spyOn(OffersCatalogTrackingManager, 'trackExplicationResult').mockImplementation(() => undefined)
    vi.spyOn(OffersCatalogTrackingManager, 'trackSaleResult').mockImplementation(() => undefined)
    vi.spyOn(OffersCatalogTrackingManager, 'trackEvaluation').mockImplementation(() => undefined)
  })

  describe('onGenerateReason', () => {
    it('should set loading state and fetch reason successfully', async () => {
      vi.mocked(getSalesPitch).mockResolvedValueOnce({ reason: 'Test reason', sale: '' })

      const [result] = withSetup(() => useCatalogDrawerContentRecommendation(OFFER_ID, ID_OFFER_RESPONSE))

      expect(result.isLoadingReason.value).toBe(false)
      expect(result.reasonResponse.value).toBe('')

      const promise = result.onGenerateReason()
      expect(result.isLoadingReason.value).toBe(true)

      await promise

      expect(result.isLoadingReason.value).toBe(false)
      expect(result.reasonResponse.value).toBe('Test reason')
      expect(result.hasErrorReason.value).toBe(false)
      expect(vi.mocked(OffersCatalogTrackingManager.trackExplicationResult)).toHaveBeenCalledWith('succeeded')
    })

    it('should handle error when fetching reason fails', async () => {
      vi.mocked(getSalesPitch).mockRejectedValueOnce(new Error('API Error'))

      const [result] = withSetup(() => useCatalogDrawerContentRecommendation(OFFER_ID, ID_OFFER_RESPONSE))

      await result.onGenerateReason()

      expect(result.isLoadingReason.value).toBe(false)
      expect(result.hasErrorReason.value).toBe(true)
      expect(result.reasonResponse.value).toBe('')
      expect(vi.mocked(OffersCatalogTrackingManager.trackExplicationResult)).toHaveBeenCalledWith('failed')
    })
  })

  describe('onGenerateSale', () => {
    it('should set loading state and fetch sale successfully', async () => {
      vi.mocked(getSalesPitch).mockResolvedValueOnce({ reason: '', sale: 'Test sale argument' })

      const [result] = withSetup(() => useCatalogDrawerContentRecommendation(OFFER_ID, ID_OFFER_RESPONSE))

      const promise = result.onGenerateSale()
      expect(result.isLoadingSale.value).toBe(true)

      await promise

      expect(result.isLoadingSale.value).toBe(false)
      expect(result.saleResponse.value).toBe('Test sale argument')
      expect(result.hasErrorSale.value).toBe(false)
      expect(vi.mocked(OffersCatalogTrackingManager.trackSaleResult)).toHaveBeenCalledWith('succeeded')
    })

    it('should handle error when fetching sale fails', async () => {
      vi.mocked(getSalesPitch).mockRejectedValueOnce(new Error('API Error'))

      const [result] = withSetup(() => useCatalogDrawerContentRecommendation(OFFER_ID, ID_OFFER_RESPONSE))

      await result.onGenerateSale()

      expect(result.isLoadingSale.value).toBe(false)
      expect(result.hasErrorSale.value).toBe(true)
      expect(result.saleResponse.value).toBe('')
      expect(vi.mocked(OffersCatalogTrackingManager.trackSaleResult)).toHaveBeenCalledWith('failed')
    })
  })

  describe('onCopyReasonToClipboard', () => {
    it('should copy reason to clipboard and show notification', async () => {
      vi.mocked(getSalesPitch).mockResolvedValueOnce({ reason: 'Reason to copy', sale: '' })
      mockClipboard.writeText.mockResolvedValueOnce(undefined)

      const [result] = withSetup(() => useCatalogDrawerContentRecommendation(OFFER_ID, ID_OFFER_RESPONSE))

      await result.onGenerateReason()
      await result.onCopyReasonToClipboard()

      expect(mockClipboard.writeText).toHaveBeenCalledWith('Reason to copy')
      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('success', 'copySuccess')
    })

    it('should not copy if reason is empty', async () => {
      const [result] = withSetup(() => useCatalogDrawerContentRecommendation(OFFER_ID, ID_OFFER_RESPONSE))

      await result.onCopyReasonToClipboard()

      expect(mockClipboard.writeText).not.toHaveBeenCalled()
    })
  })

  describe('onCopySaleToClipboard', () => {
    it('should copy sale to clipboard and show notification', async () => {
      vi.mocked(getSalesPitch).mockResolvedValueOnce({ reason: '', sale: 'Sale to copy' })
      mockClipboard.writeText.mockResolvedValueOnce(undefined)

      const [result] = withSetup(() => useCatalogDrawerContentRecommendation(OFFER_ID, ID_OFFER_RESPONSE))

      await result.onGenerateSale()
      await result.onCopySaleToClipboard()

      expect(mockClipboard.writeText).toHaveBeenCalledWith('Sale to copy')
      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('success', 'copySuccess')
    })

    it('should not copy if sale is empty', async () => {
      const [result] = withSetup(() => useCatalogDrawerContentRecommendation(OFFER_ID, ID_OFFER_RESPONSE))

      await result.onCopySaleToClipboard()

      expect(mockClipboard.writeText).not.toHaveBeenCalled()
    })
  })

  describe('handleReasonRating', () => {
    it('should rate reason and track evaluation on success', async () => {
      vi.mocked(rateOfferRecommendation).mockResolvedValueOnce(undefined)

      const [result] = withSetup(() => useCatalogDrawerContentRecommendation(OFFER_ID, ID_OFFER_RESPONSE))

      await result.handleReasonRating(true)

      expect(result.isReasonRated.value).toBe(true)
      expect(vi.mocked(OffersCatalogTrackingManager.trackEvaluation)).toHaveBeenCalledWith('good', 'reason')
    })

    it('should track bad evaluation when rating is negative', async () => {
      vi.mocked(rateOfferRecommendation).mockResolvedValueOnce(undefined)

      const [result] = withSetup(() => useCatalogDrawerContentRecommendation(OFFER_ID, ID_OFFER_RESPONSE))

      await result.handleReasonRating(false)

      expect(result.isReasonRated.value).toBe(false)
      expect(vi.mocked(OffersCatalogTrackingManager.trackEvaluation)).toHaveBeenCalledWith('bad', 'reason')
    })

    it('should not rate if already rated', async () => {
      vi.mocked(rateOfferRecommendation).mockResolvedValueOnce(undefined)

      const [result] = withSetup(() => useCatalogDrawerContentRecommendation(OFFER_ID, ID_OFFER_RESPONSE))

      await result.handleReasonRating(true)
      vi.mocked(rateOfferRecommendation).mockClear()

      await result.handleReasonRating(false)

      expect(vi.mocked(rateOfferRecommendation)).not.toHaveBeenCalled()
    })

    it('should not update state if rating fails', async () => {
      vi.mocked(rateOfferRecommendation).mockRejectedValueOnce(new Error('API Error'))

      const [result] = withSetup(() => useCatalogDrawerContentRecommendation(OFFER_ID, ID_OFFER_RESPONSE))

      await result.handleReasonRating(true)

      expect(result.isReasonRated.value).toBe(null)
      expect(vi.mocked(OffersCatalogTrackingManager.trackEvaluation)).not.toHaveBeenCalled()
    })
  })

  describe('handleSaleRating', () => {
    it('should rate sale and track evaluation on success', async () => {
      vi.mocked(rateOfferRecommendation).mockResolvedValueOnce(undefined)

      const [result] = withSetup(() => useCatalogDrawerContentRecommendation(OFFER_ID, ID_OFFER_RESPONSE))

      await result.handleSaleRating(true)

      expect(result.isSaleRated.value).toBe(true)
      expect(vi.mocked(OffersCatalogTrackingManager.trackEvaluation)).toHaveBeenCalledWith('good', 'sale')
    })

    it('should track bad evaluation when rating is negative', async () => {
      vi.mocked(rateOfferRecommendation).mockResolvedValueOnce(undefined)

      const [result] = withSetup(() => useCatalogDrawerContentRecommendation(OFFER_ID, ID_OFFER_RESPONSE))

      await result.handleSaleRating(false)

      expect(result.isSaleRated.value).toBe(false)
      expect(vi.mocked(OffersCatalogTrackingManager.trackEvaluation)).toHaveBeenCalledWith('bad', 'sale')
    })

    it('should not rate if already rated', async () => {
      vi.mocked(rateOfferRecommendation).mockResolvedValueOnce(undefined)

      const [result] = withSetup(() => useCatalogDrawerContentRecommendation(OFFER_ID, ID_OFFER_RESPONSE))

      await result.handleSaleRating(true)
      vi.mocked(rateOfferRecommendation).mockClear()

      await result.handleSaleRating(false)

      expect(vi.mocked(rateOfferRecommendation)).not.toHaveBeenCalled()
    })
  })
})
