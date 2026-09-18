import {
  catalogTags,
  catalogWithSearchTerms,
  filterCatalog,
  joinOffers,
  normalizeSearchTerm,
  offerTagColor,
  offerTagTestId,
  publishableOffers,
  publishedOfferSnapshots,
  restoredOffers,
  snapshotOf,
  unresolvedOfferIds,
} from './offers.utils'
import { OfferPriority } from '../enums/key-moments.enums'
import { DEFAULT_OFFER_TAG_COLOR } from '@pulse/styleguide/constants'
import type { CatalogOfferPayload, LinkedOfferPayload } from '../services/offers.service.types'

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

function linkedOffer(overrides: Partial<LinkedOfferPayload> = {}): LinkedOfferPayload {
  return {
    offerId: 128,
    title: 'Titre stocké',
    isPriorityVisible: false,
    isHidden: false,
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

describe('joinOffers', () => {
  it('reads the wording off the catalogue, which is the only place it lives', () => {
    const [joined] = joinOffers(
      [linkedOffer()],
      [catalogOffer({ tags: ['Gérer', 'Transverse'] })],
    )

    expect(joined.title).toBe('Pack Prévoyance TNS')
    expect(joined.tags).toEqual(['Gérer', 'Transverse'])
    expect(joined.categoryName).toBe('Protection sociale')
    expect(joined.isRetired).toBe(false)
  })

  /**
   * The row stays, named by the title it was attached under, and says nothing
   * more: detaching it is the way out, and `isRetired` is what offers it.
   */
  it('keeps an offer the catalogue no longer carries, on its title alone', () => {
    const [joined] = joinOffers([linkedOffer()], [])

    expect(joined.title).toBe('Titre stocké')
    expect(joined.tags).toBeUndefined()
    expect(joined.categoryName).toBeUndefined()
    expect(joined.shortDescription).toBeUndefined()
    expect(joined.isRetired).toBe(true)
  })

  it('reads every decision off the linked row, never off the catalogue', () => {
    const [joined] = joinOffers(
      [linkedOffer({
        comment: 'Mon accroche',
        benefitsComment: 'Mes bénéfices',
        priority: OfferPriority.PRIMARY,
        isPriorityVisible: true,
        isHidden: true,
      })],
      [catalogOffer()],
    )

    expect(joined).toMatchObject({
      comment: 'Mon accroche',
      benefitsComment: 'Mes bénéfices',
      priority: OfferPriority.PRIMARY,
      isPriorityVisible: true,
      isHidden: true,
    })
  })

  it('turns an empty catalogue into retired offers rather than an exception', () => {
    expect(joinOffers([linkedOffer(), linkedOffer({ offerId: 300 })], [])).toEqual([
      expect.objectContaining({ isRetired: true }),
      expect.objectContaining({ isRetired: true }),
    ])
  })

  it('joins an empty selection without asking anything of the catalogue', () => {
    expect(joinOffers([], [catalogOffer()])).toEqual([])
  })

  it('keeps the stored order, which is the one the client reads', () => {
    const joined = joinOffers(
      [linkedOffer({ offerId: 300 }), linkedOffer({ offerId: 128 })],
      [catalogOffer()],
    )

    expect(joined.map(offer => offer.offerId)).toEqual([300, 128])
  })
})

describe('publishableOffers', () => {
  it('drops the hidden ones and keeps the order', () => {
    expect(publishableOffers([
      linkedOffer({ offerId: 1 }),
      linkedOffer({ offerId: 2, isHidden: true }),
      linkedOffer({ offerId: 3 }),
    ]).map(offer => offer.offerId)).toEqual([1, 3])
  })

  it('keeps the decisions alone, never the catalogue wording', () => {
    expect(publishableOffers([linkedOffer({ comment: 'Mon accroche', benefitsComment: 'Mes bénéfices' })])).toEqual([
      {
        offerId: 128,
        comment: 'Mon accroche',
        benefitsComment: 'Mes bénéfices',
        priority: undefined,
        isPriorityVisible: false,
      },
    ])
  })

  it('projects an all-hidden selection onto nothing at all', () => {
    expect(publishableOffers([linkedOffer({ isHidden: true })])).toEqual([])
  })
})

describe('restoredOffers', () => {
  it('brings a published offer back into the reading, hidden since or not', () => {
    expect(restoredOffers(
      [linkedOffer({ offerId: 1, comment: 'Accroche publiée' })],
      [linkedOffer({ offerId: 1, comment: 'Accroche revue', isHidden: true })],
    )).toEqual([
      expect.objectContaining({ offerId: 1, comment: 'Accroche publiée', isHidden: false }),
    ])
  })

  /** Hiding and detaching are two gestures: undoing one must not do the other. */
  it('keeps an offer hidden after the publication, comment and degree included', () => {
    const kept = linkedOffer({
      offerId: 2,
      comment: 'Pour plus tard',
      priority: OfferPriority.SIGNIFICANT,
      isHidden: true,
    })

    expect(restoredOffers([linkedOffer({ offerId: 1 })], [linkedOffer({ offerId: 1 }), kept]))
      .toEqual([expect.objectContaining({ offerId: 1 }), kept])
  })

  it('drops an offer attached and left visible since the publication', () => {
    expect(restoredOffers(
      [linkedOffer({ offerId: 1 })],
      [linkedOffer({ offerId: 1 }), linkedOffer({ offerId: 3 })],
    ).map(offer => offer.offerId)).toEqual([1])
  })

  it('leaves a kept offer at the rank it holds rather than at the end', () => {
    expect(restoredOffers(
      [linkedOffer({ offerId: 1 }), linkedOffer({ offerId: 3 })],
      [
        linkedOffer({ offerId: 1 }),
        linkedOffer({ offerId: 2, isHidden: true }),
        linkedOffer({ offerId: 3 }),
      ],
    ).map(offer => offer.offerId)).toEqual([1, 2, 3])
  })

  it('restores the published order, whatever order the screen holds', () => {
    expect(restoredOffers(
      [linkedOffer({ offerId: 1 }), linkedOffer({ offerId: 2 })],
      [linkedOffer({ offerId: 2 }), linkedOffer({ offerId: 1 })],
    ).map(offer => offer.offerId)).toEqual([1, 2])
  })

  it('restores nothing but the hidden ones on a publication that froze none', () => {
    expect(restoredOffers([], [linkedOffer({ offerId: 2, isHidden: true })])
      .map(offer => offer.offerId)).toEqual([2])
  })
})

describe('snapshotOf', () => {

  /**
   * Which offer, and the title it is named by. The wording is not stored: the
   * microservice keeps none of it, and what the client reads is composed at
   * publication from the catalogue as it stands then.
   */
  it('stores the offer and the title it was attached under', () => {
    expect(snapshotOf(catalogOffer({ imageUrl: 'prevoyance.png', pdfUrl: 'prevoyance.pdf' })))
      .toEqual({
        offerId: 128,
        title: 'Pack Prévoyance TNS',
        isPriorityVisible: false,
        isHidden: false,
      })
  })

  it('attaches an offer neither hidden nor showing a degree it has not got', () => {
    const snapshot = snapshotOf(catalogOffer())

    // a visible priority without a priority is the one 400 the screen could
    // trigger on its own: a fresh attachment must never be able to say it
    expect(snapshot.priority).toBeUndefined()
    expect(snapshot.isPriorityVisible).toBe(false)
    expect(snapshot.isHidden).toBe(false)
  })
})

describe('publishedOfferSnapshots', () => {

  /**
   * The wording comes from the catalogue and never from the stored row: the
   * microservice keeps nothing of it but the title, so a snapshot rebuilt from
   * what it serves would publish a card with no description at all.
   */
  it('describes every visible recommendation from the catalogue', () => {
    const snapshots = publishedOfferSnapshots([linkedOffer()], [catalogOffer()])

    expect(snapshots).toEqual([{
      offerId: 128,
      title: 'Pack Prévoyance TNS',
      shortDescription: 'Couverture des indépendants',
      categoryName: 'Protection sociale',
      subCategoryName: 'Prévoyance',
      imageUrl: undefined,
      pdfUrl: undefined,
    }])
  })

  /** Hiding a recommendation keeps it attached and out of what is published. */
  it('leaves a hidden recommendation out', () => {
    const snapshots = publishedOfferSnapshots([linkedOffer({ isHidden: true })], [catalogOffer()])

    expect(snapshots).toEqual([])
  })

  /** The order of the list is the order of the reading, and it is kept. */
  it('keeps the reading order', () => {
    const snapshots = publishedOfferSnapshots(
      [linkedOffer({ offerId: 512 }), linkedOffer()],
      [catalogOffer(), catalogOffer({ id: 512, title: 'Santé TNS' })],
    )

    expect(snapshots.map(offer => offer.offerId)).toEqual([512, 128])
  })

  /** What nothing describes is not published: it is what blocks the gesture. */
  it('drops a recommendation the catalogue no longer carries', () => {
    const snapshots = publishedOfferSnapshots([linkedOffer({ offerId: 512 })], [catalogOffer()])

    expect(snapshots).toEqual([])
  })
})

describe('unresolvedOfferIds', () => {

  it('names a visible recommendation the catalogue no longer carries', () => {
    expect(unresolvedOfferIds([linkedOffer({ offerId: 512 })], [catalogOffer()])).toEqual([512])
  })

  it('says nothing of a recommendation the catalogue still carries', () => {
    expect(unresolvedOfferIds([linkedOffer()], [catalogOffer()])).toEqual([])
  })

  /** A hidden row never goes out, so nothing has to be known about it. */
  it('says nothing of a hidden recommendation', () => {
    const unresolved = unresolvedOfferIds(
      [linkedOffer({ offerId: 512, isHidden: true })],
      [catalogOffer()],
    )

    expect(unresolved).toEqual([])
  })

  /** A catalogue that could not be read at all reads as everything unresolved. */
  it('names every visible recommendation when the catalogue is empty', () => {
    expect(unresolvedOfferIds([linkedOffer()], [])).toEqual([128])
  })
})
