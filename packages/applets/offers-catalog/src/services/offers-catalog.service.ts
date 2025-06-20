import { API_PREFIXES } from '@pulse/common/constants'
import { commonApi } from '@pulse/common'
import type { OffersCatalogResponse, OfferCatalogDetailsResponse } from '../types/offers-catalog.types'

export async function getOffersCatalog() {
  const url = `${API_PREFIXES.OFFER}/catalog/offers`
  const { data } = await commonApi().gateway.get<OffersCatalogResponse>(url)

  return data
}

export async function getOfferCatalogPdf(fileName: string) {
  const url = `${API_PREFIXES.OFFER}/catalog/${fileName}`
  const { data } = await commonApi().gateway
    .get<ArrayBuffer>(url, {
      responseType: 'arraybuffer',
    })

  return data
}

export async function getOfferCatalogDetails(offerId: number) {
  const url = `${API_PREFIXES.OFFER}/catalog/offers/${offerId}`
  const { data } = await commonApi().gateway.get<OfferCatalogDetailsResponse>(url)

  return data
}
