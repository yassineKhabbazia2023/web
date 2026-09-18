import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import type { LinkedOfferPayload, OffersCatalogPayload } from './offers.service.types'

/** The only door the recommendations of an exercice come in and out through. */
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

  /**
   * The attached list, in the order it is meant to be read, **hidden offers
   * included**: this is the working state of the firm, and leaving them out
   * would tell it they had been detached.
   */
  static async getLinkedOffers(
    entityId: number,
    exerciceId: number,
  ): Promise<LinkedOfferPayload[]> {
    const { data } = await api.gateway.get<LinkedOfferPayload[]>(
      `${API_PREFIXES.KEY_MOMENTS}/accounts/${entityId}/exercices/${exerciceId}/offers`,
    )

    return data
  }

  /**
   * Replaces the whole list rather than one offer: detaching is said by sending
   * the list without it, and **the order of the array is the rank** — there is
   * no position to send.
   *
   * The `offers` key is always written, the empty array included: sending it
   * absent would mean "detach everything" to a caller that does not know the
   * field yet, which is exactly why the microservice answers 400 to a body
   * without it.
   */
  static async saveLinkedOffers(
    entityId: number,
    exerciceId: number,
    offers: LinkedOfferPayload[],
  ): Promise<void> {
    await api.gateway.put(
      `${API_PREFIXES.KEY_MOMENTS}/accounts/${entityId}/exercices/${exerciceId}/offers`,
      { offers },
    )
  }
}
