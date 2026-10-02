import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import type { OffersCatalogPayload } from './offers.service.types'

/** What this module reads of the offer domain: the catalogue, and nothing else. */
export class OffersService {

  /**
   * The catalogue, read on the Offer domain — the single call this module makes
   * outside of Keymoments, and the only one the offer permission really guards.
   *
   * Both lists are defaulted rather than trusted: a catalogue that answers
   * without them is an empty catalogue, which the page renders, where a raise
   * here would take the whole report down with it.
   */
  static async getOffersCatalog(): Promise<OffersCatalogPayload> {
    const { data } = await api.gateway.get<OffersCatalogPayload>(
      `${API_PREFIXES.OFFER}/catalog/offers`,
    )

    return {
      offers: data?.offers ?? [],
      categories: data?.categories ?? [],
    }
  }
}
