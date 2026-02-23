import { AmplitudeService } from '@pulse/common/services/amplitude'
import type {
  TrackingResultStatus,
  TrackingSearchMethod,
  TrackingEvaluationResult,
  TrackingEvaluationLocalisation,
} from './offers-catalog-tracking.type'

export class OffersCatalogTrackingManager {
  static trackExplicationResult(status: TrackingResultStatus) {
    AmplitudeService.track('Offer IA Explication', {
      offer_IA_explication_result: status,
    })
  }

  static trackSaleResult(status: TrackingResultStatus) {
    AmplitudeService.track('Offer IA Sale', {
      offer_IA_sale_result: status,
    })
  }

  static trackEvaluation(result: TrackingEvaluationResult, localisation: TrackingEvaluationLocalisation) {
    AmplitudeService.track('Offer IA Evaluation', {
      offer_IA_result: result,
      offer_IA_localisation: localisation,
    })
  }

  static trackSearch(searchTerm: string, method: TrackingSearchMethod, status: TrackingResultStatus) {
    AmplitudeService.track('Offer Searched', {
      offer_search: searchTerm,
      offer_searched_method: method,
      offer_searched_IA_result: status,
    })
  }

  static trackConsulted(offerName: string, method: TrackingSearchMethod) {
    AmplitudeService.track('Offer Consulted', {
      offer_name: offerName,
      offer_consulted_method: method,
    })
  }
}
