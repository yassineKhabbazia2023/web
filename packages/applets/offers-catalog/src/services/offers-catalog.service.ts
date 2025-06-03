import { API_PREFIXES } from '@pulse/common/constants'
import { commonApi } from '@pulse/common'
import type { OffersCatalogResponse } from '../types/offers-catalog.types'

export async function getOffersCatalog() {
  const url = `${API_PREFIXES.OFFER}/catalog/offers`
  const { data } = await commonApi().gateway.get<OffersCatalogResponse>(url)

  return data
}
