import { api } from '@pulse/common/api'
import { OffersService } from './offers.service'
import { OfferPriority } from '../enums/key-moments.enums'
import type { CatalogOfferPayload, LinkedOfferPayload } from './offers.service.types'

const LINKED: LinkedOfferPayload[] = [
  {
    offerId: 128,
    title: 'Pack Prévoyance TNS',
    comment: 'Adapté à votre passage en SASU',
    priority: OfferPriority.PRIMARY,
    isPriorityVisible: true,
    isHidden: false,
  },
]

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
  it('reads the linked offers of an exercice', async () => {
    vi.mocked(api.gateway.get).mockResolvedValueOnce({ data: LINKED })

    await expect(OffersService.getLinkedOffers(42, 7)).resolves.toEqual(LINKED)
    expect(vi.mocked(api.gateway.get)).toHaveBeenCalledWith(
      'keymoments/api/accounts/42/exercices/7/offers',
    )
  })

  it('writes the whole list, under the offers key', async () => {
    vi.mocked(api.gateway.put).mockResolvedValueOnce({ data: undefined })

    await OffersService.saveLinkedOffers(42, 7, LINKED)

    expect(vi.mocked(api.gateway.put)).toHaveBeenCalledWith(
      'keymoments/api/accounts/42/exercices/7/offers',
      { offers: LINKED },
    )
  })

  it('sends an empty list rather than an empty body, which the microservice refuses', async () => {
    vi.mocked(api.gateway.put).mockResolvedValueOnce({ data: undefined })

    await OffersService.saveLinkedOffers(42, 7, [])

    expect(vi.mocked(api.gateway.put)).toHaveBeenCalledWith(expect.any(String), { offers: [] })
  })

  it('keeps the order it is given, which is the rank', async () => {
    vi.mocked(api.gateway.put).mockResolvedValueOnce({ data: undefined })
    const second: LinkedOfferPayload = { ...LINKED[0], offerId: 300, title: 'Épargne salariale' }

    await OffersService.saveLinkedOffers(42, 7, [second, LINKED[0]])

    expect(vi.mocked(api.gateway.put).mock.calls[0][1]).toEqual({ offers: [second, LINKED[0]] })
  })

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
