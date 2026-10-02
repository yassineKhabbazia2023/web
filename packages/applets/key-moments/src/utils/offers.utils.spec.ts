import {
  catalogTags,
  catalogWithSearchTerms,
  filterCatalog,
  normalizeSearchTerm,
  offerTagColor,
  offerTagTestId,
} from './offers.utils'
import { DEFAULT_OFFER_TAG_COLOR } from '@pulse/styleguide/constants'
import type { CatalogOfferPayload } from '../services/offers.service.types'

function catalogOffer(overrides: Partial<CatalogOfferPayload> = {}): CatalogOfferPayload {
  return {
    id: 128,
    title: 'Pack Prévoyance TNS',
    shortDescription: 'Couverture des indépendants',
    subCategory: {
      subCategoryId: 3,
      name: 'Prévoyance',
      category: { categoryId: 1, name: 'Protection sociale' },
    },
    ...overrides,
  }
}

describe('normalizeSearchTerm', () => {
  it('flattens accents and case, so that a reader never has to spell them', () => {
    expect(normalizeSearchTerm('Prévoyance')).toBe(normalizeSearchTerm('prevoyance'))
  })
})

describe('offerTagColor', () => {
  it('writes a tag of the table in its colour', () => {
    expect(offerTagColor('Transverse')).toBe('warning')
  })

  it('falls back to the neutral of the set on a tag the table does not name', () => {
    expect(offerTagColor('EC')).toBe(DEFAULT_OFFER_TAG_COLOR)
  })
})

describe('catalogTags', () => {
  it('names every tag of the catalogue once', () => {
    const tags = catalogTags([
      catalogOffer({ tags: ['Transverse', 'Gérer'] }),
      catalogOffer({ id: 300, tags: ['Gérer', 'Transverse'] }),
    ])

    expect(tags).toEqual(['Gérer', 'Transverse'])
  })

  /**
   * The row has to read as one gradient, which no alphabetical order gives:
   * `Conseil` is a blue, `Gérer` an info, `Avocats` a green, `Transverse` a
   * yellow — and that is the walk, whatever their initials.
   */
  it('groups the tags by colour family, hue by hue', () => {
    const tags = catalogTags([
      catalogOffer({ tags: ['Avocats', 'Transverse', 'Conseil', 'Gérer'] }),
    ])

    expect(tags).toEqual(['Conseil', 'Gérer', 'Avocats', 'Transverse'])
  })

  it('keeps a family alphabetical, so that a chip stays findable inside it', () => {
    const tags = catalogTags([
      catalogOffer({ tags: ['Partenariat', 'Conseil', 'Filiale Gestion Privée'] }),
    ])

    expect(tags).toEqual(['Conseil', 'Filiale Gestion Privée', 'Partenariat'])
  })

  /** An unstyled tag lands in the neutral family, never at the head of the row. */
  it('sorts a tag the table does not name with the family it falls back to', () => {
    expect(catalogTags([catalogOffer({ tags: ['EC', 'Conseil', 'Gérer'] })]))
      .toEqual(['Conseil', 'EC', 'Gérer'])
  })

  it('offers no chip on a catalogue that tags nothing', () => {
    expect(catalogTags([catalogOffer(), catalogOffer({ id: 300, tags: [] })])).toEqual([])
  })
})

describe('offerTagTestId', () => {
  it('flattens accents and binds spaces, so that a hook never spells the label', () => {
    expect(offerTagTestId('Gestion sociale')).toBe('gestion-sociale')
    expect(offerTagTestId('Gérer')).toBe('gerer')
  })
})

describe('filterCatalog', () => {
  const catalog = catalogWithSearchTerms([
    catalogOffer({ tags: ['Gérer'] }),
    catalogOffer({
      id: 300,
      title: 'Épargne salariale',
      shortDescription: 'Intéressement',
      subCategory: {
        subCategoryId: 9,
        name: 'Épargne',
        category: { categoryId: 2, name: 'Développer' },
      },
      tags: ['Développer', 'Transverse'],
    }),
  ])

  it('narrows nothing on an empty search', () => {
    expect(filterCatalog(catalog, '')).toHaveLength(2)
  })

  it('finds an offer by a word of its category', () => {
    expect(filterCatalog(catalog, 'developper').map(offer => offer.id)).toEqual([300])
  })

  it('finds an offer by a word of its short description', () => {
    expect(filterCatalog(catalog, 'interessement').map(offer => offer.id)).toEqual([300])
  })

  it('narrows on the chip alone when the search is empty', () => {
    expect(filterCatalog(catalog, '', 'Transverse').map(offer => offer.id)).toEqual([300])
  })

  it('finds an offer on its words whatever their order', () => {
    expect(filterCatalog(catalog, 'salariale epargne').map(offer => offer.id)).toEqual([300])
  })

  /**
   * The chip reads the tags and nothing else: an offer whose category is named
   * like a tag it does not carry is not an answer to that chip.
   */
  it('narrows on the tags of the offer, never on its category', () => {
    expect(filterCatalog(catalog, '', 'Protection sociale')).toEqual([])
    expect(filterCatalog(catalog, '', 'Gérer').map(offer => offer.id)).toEqual([128])
  })

  it('combines the search and the chip rather than choosing between them', () => {
    expect(filterCatalog(catalog, 'epargne', 'Gérer')).toEqual([])
    expect(filterCatalog(catalog, 'epargne', 'Transverse')).toHaveLength(1)
  })

  it('answers no chip at all on an offer the référentiel tags with nothing', () => {
    const untagged = catalogWithSearchTerms([catalogOffer()])

    expect(filterCatalog(untagged, '')).toHaveLength(1)
    expect(filterCatalog(untagged, '', 'Gérer')).toEqual([])
  })
})
