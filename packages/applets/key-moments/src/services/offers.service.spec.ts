import { api } from '@pulse/common/api'
import { OffersService } from './offers.service'
import type { CatalogOfferPayload } from './offers.service.types'

const CATALOG_OFFER: CatalogOfferPayload = {
  id: 128,
  title: 'Pack Prévoyance TNS',
  shortDescription: 'Une couverture dédiée aux indépendants',
  imageUrl: 'prevoyance.png',
  pdfUrl: 'prevoyance.pdf',
  subCategory: {
    subCategoryId: 3,
    name: 'Prévoyance',
    category: { categoryId: 1, name: 'Protection sociale' },
  },
}

describe('OffersService', () => {
  it('reads the catalogue on the offer domain', async () => {
    vi.mocked(api.gateway.get).mockResolvedValueOnce({
      data: { offers: [CATALOG_OFFER], categories: [] },
    })

    const catalog = await OffersService.getOffersCatalog()

    expect(vi.mocked(api.gateway.get)).toHaveBeenCalledWith('offer/api/catalog/offers')
    expect(catalog.offers).toEqual([CATALOG_OFFER])
  })

  it('reads an empty catalogue rather than raising on a payload without lists', async () => {
    vi.mocked(api.gateway.get).mockResolvedValueOnce({ data: {} })

    await expect(OffersService.getOffersCatalog()).resolves.toEqual({
      offers: [],
      categories: [],
    })
  })
})
