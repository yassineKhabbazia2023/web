import { API_PREFIXES } from '@pulse/common/constants'
import { api } from '@pulse/common/api'
import type {
  OffersCatalogResponse,
  OfferCatalogDetailsResponse,
  OffersRecommendationsResponse,
  OfferEvaluationRequest,
  SalesPitchResponse,
} from '../types/offers-catalog.types'
import type { SalesPitchSection } from './offers-catalog.service.enum'

export async function getOffersCatalog() {
  const url = `${API_PREFIXES.OFFER}/catalog/offers`
  const { data } = await api.gateway.get<OffersCatalogResponse>(url)

  return data
}

export async function getOfferCatalogPdf(fileName: string) {
  const url = `${API_PREFIXES.OFFER}/catalog/${fileName}`
  const { data } = await api.gateway
    .get<ArrayBuffer>(url, {
      responseType: 'arraybuffer',
    })

  return data
}

export async function getOfferCatalogDetails(offerId: number) {
  const url = `${API_PREFIXES.OFFER}/catalog/offers/${offerId}`
  const { data } = await api.gateway.get<OfferCatalogDetailsResponse>(url)

  return data
}

export async function getOffersRecommendations(question: string) {
  const url = `${API_PREFIXES.AI_SERVICES}/recommendations/offers`
  const { data } = await api.gateway.post<OffersRecommendationsResponse>(url, { question })

  return data
}

export async function rateOfferRecommendation(request : OfferEvaluationRequest) {
  const url = `${API_PREFIXES.AI_SERVICES}/recommendations/validation`

  await api.gateway.put(url, request)
}

export async function getSalesPitch(
  offerResponseId: string,
  offerId: string,
  section: SalesPitchSection,
) {
  const url = `${API_PREFIXES.AI_SERVICES}/recommendations/sales-pitch`
  const { data } = await api.gateway.post<SalesPitchResponse>(url, {
    id_offer_response: offerResponseId,
    offer_id: offerId,
    section,
  })

  return data
}
