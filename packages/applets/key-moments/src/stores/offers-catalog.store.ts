import { shallowRef } from 'vue'
import { defineStore } from 'pinia'
import { OffersService } from '../services/offers.service'
import { catalogWithSearchTerms } from '../utils/offers.utils'
import type { SearchableOffer } from '../types/key-moments.types'

/**
 * The offers catalogue, read and indexed for search once for the session, the
 * way the themes are. A failed read is not kept, the next call reads again.
 */
export const useOffersCatalogStore = defineStore('key-moments-offers-catalog', () => {
  /** Read-only and only ever replaced whole: not worth a deep proxy */
  const catalog = shallowRef<SearchableOffer[]>([])

  let reading: Promise<void> | undefined

  function readCatalog(): Promise<void> {
    reading ??= OffersService.getOffersCatalog()
      .then((read) => {
        catalog.value = catalogWithSearchTerms(read.offers)
      })
      .catch((error: unknown) => {
        reading = undefined
        throw error
      })

    return reading
  }

  return { catalog, readCatalog }
})
