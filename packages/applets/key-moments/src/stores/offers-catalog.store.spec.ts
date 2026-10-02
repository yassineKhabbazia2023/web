import { createPinia, setActivePinia } from 'pinia'
import { OffersService } from '../services/offers.service'
import { useOffersCatalogStore } from './offers-catalog.store'

const OFFER = {
  id: 10,
  title: 'Tableau de bord',
  subCategory: { subCategoryId: 1, name: 'Pilotage', category: { categoryId: 1, name: 'Gestion' } },
}

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('useOffersCatalogStore', () => {
  it('should read the catalogue once for the session, indexed for search', async () => {
    vi.spyOn(OffersService, 'getOffersCatalog').mockResolvedValue({ offers: [OFFER], categories: [] })
    const store = useOffersCatalogStore()

    await store.readCatalog()
    await store.readCatalog()

    expect(store.catalog).toEqual([expect.objectContaining({ id: 10, searchTerms: expect.any(String) })])
    expect(vi.mocked(OffersService.getOffersCatalog)).toHaveBeenCalledOnce()
  })

  it('should read again after a failure', async () => {
    vi.spyOn(OffersService, 'getOffersCatalog')
      .mockRejectedValueOnce(new Error('down'))
      .mockResolvedValueOnce({ offers: [OFFER], categories: [] })
    const store = useOffersCatalogStore()

    await expect(store.readCatalog()).rejects.toThrow('down')
    await store.readCatalog()

    expect(store.catalog).toHaveLength(1)
    expect(vi.mocked(OffersService.getOffersCatalog)).toHaveBeenCalledTimes(2)
  })
})
