import { AmplitudeService } from '@pulse/common/services/amplitude'
import { OffersCatalogTrackingManager } from './offers-catalog-tracking.manager'

describe('OffersCatalogTrackingManager', () => {
  describe('trackExplicationResult', () => {
    it('should track explication result with succeeded status', () => {
      OffersCatalogTrackingManager.trackExplicationResult('succeeded')

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Offer IA Explication',
        { offer_IA_explication_result: 'succeeded' },
      )
    })

    it('should track explication result with failed status', () => {
      OffersCatalogTrackingManager.trackExplicationResult('failed')

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Offer IA Explication',
        { offer_IA_explication_result: 'failed' },
      )
    })
  })

  describe('trackSaleResult', () => {
    it('should track sale result with succeeded status', () => {
      OffersCatalogTrackingManager.trackSaleResult('succeeded')

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Offer IA Sale',
        { offer_IA_sale_result: 'succeeded' },
      )
    })

    it('should track sale result with failed status', () => {
      OffersCatalogTrackingManager.trackSaleResult('failed')

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Offer IA Sale',
        { offer_IA_sale_result: 'failed' },
      )
    })
  })

  describe('trackEvaluation', () => {
    it('should track evaluation with good result and research localisation', () => {
      OffersCatalogTrackingManager.trackEvaluation('good', 'research')

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Offer IA Evaluation',
        {
          offer_IA_result: 'good',
          offer_IA_localisation: 'research',
        },
      )
    })

    it('should track evaluation with bad result and reason localisation', () => {
      OffersCatalogTrackingManager.trackEvaluation('bad', 'reason')

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Offer IA Evaluation',
        {
          offer_IA_result: 'bad',
          offer_IA_localisation: 'reason',
        },
      )
    })

    it('should track evaluation with good result and sale localisation', () => {
      OffersCatalogTrackingManager.trackEvaluation('good', 'sale')

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Offer IA Evaluation',
        {
          offer_IA_result: 'good',
          offer_IA_localisation: 'sale',
        },
      )
    })
  })

  describe('trackSearch', () => {
    it('should track manual search with succeeded status', () => {
      OffersCatalogTrackingManager.trackSearch('test query', 'manual', 'succeeded')

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Offer Searched',
        {
          offer_search: 'test query',
          offer_searched_method: 'manual',
          offer_searched_IA_result: 'succeeded',
        },
      )
    })

    it('should track IA search with succeeded status', () => {
      OffersCatalogTrackingManager.trackSearch('test query', 'IA', 'succeeded')

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Offer Searched',
        {
          offer_search: 'test query',
          offer_searched_method: 'IA',
          offer_searched_IA_result: 'succeeded',
        },
      )
    })

    it('should track IA search with failed status', () => {
      OffersCatalogTrackingManager.trackSearch('test query', 'IA', 'failed')

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Offer Searched',
        {
          offer_search: 'test query',
          offer_searched_method: 'IA',
          offer_searched_IA_result: 'failed',
        },
      )
    })
  })

  describe('trackConsulted', () => {
    it('should track offer consulted with manual method', () => {
      OffersCatalogTrackingManager.trackConsulted('Test Offer', 'manual')

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Offer Consulted',
        {
          offer_name: 'Test Offer',
          offer_consulted_method: 'manual',
        },
      )
    })

    it('should track offer consulted with IA method', () => {
      OffersCatalogTrackingManager.trackConsulted('Test Offer', 'IA')

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Offer Consulted',
        {
          offer_name: 'Test Offer',
          offer_consulted_method: 'IA',
        },
      )
    })
  })
})
