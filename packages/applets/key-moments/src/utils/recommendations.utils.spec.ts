import { RecommendationPriority, RecommendationRubric } from '../enums/key-moments.enums'
import {
  compareRecommendations,
  categoryLinesOf,
  copiedFromCategory,
  countWithoutTheme,
  emptyRecommendation,
  groupedByRubric,
  isComplete,
  movedInRubric,
  patched,
  publishableRecommendationsOf,
  publishedOffersOf,
  refusedThemeKeysOf,
  toCategoryPayload,
  toPayload,
  toRubricViews,
  toWorking,
  unresolvedOfferIdsOf,
  without,
} from './recommendations.utils'
import type { CatalogOfferPayload } from '../services/offers.service.types'
import type { RecommendationThemePayload } from '../services/recommendations.service.types'
import type { PublishedRecommendationPayload, WorkingRecommendation } from '../types/recommendations.types'

const CATALOG: CatalogOfferPayload[] = [
  {
    id: 10,
    title: 'Tableau de bord',
    shortDescription: 'Pilotage.',
    imageUrl: 'tdb.png',
    subCategory: { subCategoryId: 1, name: 'Pilotage', category: { categoryId: 1, name: 'Gestion' } },
    tags: ['Conseil'],
  },
  { id: 11, title: 'Épargne salariale', subCategory: { subCategoryId: 2, name: 'Social', category: { categoryId: 2, name: 'RH' } } },
]

const THEMES: RecommendationThemePayload[] = [
  { id: 1, rubric: RecommendationRubric.MANAGEMENT, label: 'Trésorerie' },
  { id: 2, rubric: RecommendationRubric.MANAGEMENT, label: 'Outil de gestion' },
  { id: 3, rubric: RecommendationRubric.SOCIAL, label: 'Épargne' },
  { id: 4, rubric: RecommendationRubric.WEALTH, label: 'Prévoyance' },
]

const EMPTY_FIELDS = { priority: null, observations: null, risk: null, recommendation: null }

function working(overrides: Partial<WorkingRecommendation> = {}): WorkingRecommendation {
  return {
    key: 'k-1',
    themeId: 1,
    offerIds: [],
    isHidden: false,
    isFromCategory: false,
    ...overrides,
  }
}

describe('toWorking / copiedFromCategory / categoryLinesOf / emptyRecommendation', () => {
  it('should key every line with a key of its own, the null fields absent', () => {
    const lines = toWorking([
      { ...EMPTY_FIELDS, themeId: 3, priority: RecommendationPriority.PRIMARY, offerIds: [], isHidden: true, isFromCategory: true },
      { ...EMPTY_FIELDS, themeId: 3, offerIds: [], isHidden: false, isFromCategory: false },
    ])

    expect(lines[0].key).not.toBe(lines[1].key)
    expect(lines[0]).toEqual({
      key: lines[0].key,
      themeId: 3,
      priority: RecommendationPriority.PRIMARY,
      offerIds: [],
      isHidden: true,
      isFromCategory: true,
    })
  })

  it('should copy a category visible, its theme locked', () => {
    const [line] = copiedFromCategory([{ ...EMPTY_FIELDS, themeId: 4, offerIds: [3] }])

    expect(line).toEqual(expect.objectContaining({ themeId: 4, offerIds: [3], isHidden: false, isFromCategory: true }))
  })

  it('should key the lines of a category for its own editor, their theme free', () => {
    const [line] = categoryLinesOf([{ ...EMPTY_FIELDS, themeId: 4, offerIds: [3] }])

    expect(line).toEqual(expect.objectContaining({ themeId: 4, offerIds: [3], isFromCategory: false }))
  })

  it('should add an empty visible line in the asked rubric, without a theme', () => {
    const line = emptyRecommendation(RecommendationRubric.SECTOR)

    expect(line).toEqual(expect.objectContaining({ rubric: RecommendationRubric.SECTOR, offerIds: [], isHidden: false, isFromCategory: false }))
    expect(line.themeId).toBeUndefined()
  })
})

describe('toPayload', () => {
  it('should send the complete lines only, the theme by id, the empty fields null, no key nor rubric', () => {
    const payload = toPayload([
      working({ themeId: undefined, rubric: RecommendationRubric.SOCIAL, recommendation: 'jamais envoyée' }),
      working({ key: 'k-2', themeId: 2, rubric: RecommendationRubric.MANAGEMENT, priority: RecommendationPriority.PRIMARY, observations: '', risk: 'R', offerIds: [10] }),
    ])

    expect(payload).toEqual([{
      ...EMPTY_FIELDS,
      themeId: 2,
      priority: RecommendationPriority.PRIMARY,
      risk: 'R',
      offerIds: [10],
      isHidden: false,
      isFromCategory: false,
    }])
  })

  it('should drop the visibility and the origin for a category', () => {
    expect(toCategoryPayload([working({ isHidden: true, isFromCategory: true })])).toEqual([{ ...EMPTY_FIELDS, themeId: 1, offerIds: [] }])
  })

  it('should tell an incomplete line apart', () => {
    expect(isComplete(working({ themeId: undefined }))).toBe(false)
    expect(isComplete(working())).toBe(true)
  })
})

describe('refusedThemeKeysOf', () => {
  const sent = [
    working({ key: 'a' }),
    working({ key: 'incomplete', themeId: undefined, rubric: RecommendationRubric.SOCIAL }),
    working({ key: 'b', themeId: 404 }),
    working({ key: 'c', themeId: 405 }),
  ]

  function refusal(pointers: string[]) {
    return {
      response: {
        status: 422,
        data: {
          code: 'unknown-theme',
          errors: pointers.map(pointer => ({ code: 'unknown-theme', pointer, detail: 'Theme 404 is not in the referential.' })),
        },
      },
    }
  }

  it('should name the refused lines by key, the positions counted among the lines sent', () => {
    expect(refusedThemeKeysOf(refusal(['/recommendations/1/themeId', '/recommendations/2/themeId']), sent)).toEqual(['b', 'c'])
  })

  it('should ignore a pointer it cannot place', () => {
    expect(refusedThemeKeysOf(refusal(['/recommendations/9/themeId', '/categoryId']), sent)).toEqual([])
  })

  it('should tell apart any other refusal', () => {
    expect(refusedThemeKeysOf({ response: { status: 400, data: { title: 'Bad' } } }, sent)).toBeUndefined()
    expect(refusedThemeKeysOf(new Error('network'), sent)).toBeUndefined()
  })
})

describe('the local gestures', () => {
  const list = [
    working({ key: 'a', themeId: 3 }),
    working({ key: 'b' }),
    working({ key: 'c', themeId: undefined, rubric: RecommendationRubric.MANAGEMENT }),
    working({ key: 'd', themeId: 2 }),
  ]

  it('should patch the keyed line and keep its key', () => {
    const next = patched(list, 'b', { themeId: 2, key: 'hacked' } as Partial<WorkingRecommendation>)

    expect(next[1]).toEqual(expect.objectContaining({ key: 'b', themeId: 2 }))
    expect(next[0]).toBe(list[0])
  })

  it('should remove the keyed line', () => {
    expect(without(list, 'c').map(line => line.key)).toEqual(['a', 'b', 'd'])
  })

  it('should move a line among the lines of its own rubric, read from its theme, the others kept in place', () => {
    expect(movedInRubric(list, 'd', 0, THEMES).map(line => line.key)).toEqual(['a', 'd', 'b', 'c'])
    expect(movedInRubric(list, 'b', 5, THEMES).map(line => line.key)).toEqual(['a', 'c', 'd', 'b'])
    expect(movedInRubric(list, 'zz', 0, THEMES)).toBe(list)
  })
})

describe('toRubricViews', () => {
  it('should list every rubric in order, empty or not, the offers resolved and the retired ones told', () => {
    const views = toRubricViews([working({ themeId: 4, offerIds: [10, 99] })], CATALOG, THEMES, new Set())

    expect(views.map(view => view.rubric)).toEqual(['management', 'accounting', 'sector', 'social', 'wealth'])
    expect(views[4].views[0]).toEqual(expect.objectContaining({ themeLabel: 'Prévoyance', isThemeRefused: false }))
    expect(views[4].views[0].offers).toEqual([
      { offerId: 10, title: 'Tableau de bord', shortDescription: 'Pilotage.', categoryName: 'Gestion', tags: ['Conseil'], isRetired: false },
      { offerId: 99, title: '99', shortDescription: undefined, categoryName: undefined, tags: undefined, isRetired: true },
    ])
    expect(views[0].views).toEqual([])
  })

  it('should offer each rubric its own themes, in the order served', () => {
    const views = toRubricViews([], CATALOG, THEMES, new Set())

    expect(views[0].themes.map(theme => theme.id)).toEqual([1, 2])
    expect(views[1].themes).toEqual([])
  })

  it('should place a line without a theme in its rubric, and a theme unknown to the list nowhere', () => {
    const views = toRubricViews([
      working({ key: 'new', themeId: undefined, rubric: RecommendationRubric.SECTOR }),
      working({ key: 'lost', themeId: 404 }),
    ], CATALOG, THEMES, new Set())

    expect(views[2].views.map(view => view.key)).toEqual(['new'])
    expect(views[2].views[0].themeLabel).toBeUndefined()
    expect(views.flatMap(view => view.views).map(view => view.key)).toEqual(['new'])
  })

  it('should flag the lines refused for their theme', () => {
    const views = toRubricViews([working({ key: 'a' }), working({ key: 'b' })], CATALOG, THEMES, new Set(['b']))

    expect(views[0].views.map(view => view.isThemeRefused)).toEqual([false, true])
  })
})

describe('countWithoutTheme', () => {
  it('should count the lines without a theme, hidden ones included since they would be lost all the same', () => {
    expect(countWithoutTheme([
      working({ key: 'a' }),
      working({ key: 'b', themeId: undefined, rubric: RecommendationRubric.SOCIAL }),
      working({ key: 'c', themeId: undefined, rubric: RecommendationRubric.SOCIAL, isHidden: true }),
    ])).toBe(2)
  })
})

describe('the publishable projection', () => {
  const lines = [
    working({ key: 'a', priority: RecommendationPriority.SIGNIFICANT, observations: 'O', risk: '', offerIds: [10, 99, 11] }),
    working({ key: 'b', isHidden: true, offerIds: [11] }),
    working({ key: 'c', themeId: undefined, rubric: RecommendationRubric.MANAGEMENT, offerIds: [11] }),
    working({ key: 'e', themeId: 404 }),
  ]

  it('should keep the visible lines with a known theme, worded from the list, the retired offers excluded, the empty fields absent', () => {
    expect(publishableRecommendationsOf(lines, CATALOG, THEMES)).toEqual([{
      rubric: RecommendationRubric.MANAGEMENT,
      theme: 'Trésorerie',
      priority: RecommendationPriority.SIGNIFICANT,
      observations: 'O',
      offers: [
        { offerId: 10, title: 'Tableau de bord', shortDescription: 'Pilotage.', categoryName: 'Gestion', subCategoryName: 'Pilotage', imageUrl: 'tdb.png', pdfUrl: undefined },
        { offerId: 11, title: 'Épargne salariale', shortDescription: undefined, categoryName: 'RH', subCategoryName: 'Social', imageUrl: undefined, pdfUrl: undefined },
      ],
    }])
  })

  it('should hand the publication each cited offer once, the hidden lines excluded', () => {
    expect(publishedOffersOf(lines, CATALOG).map(offer => offer.offerId)).toEqual([10, 11])
  })

  it('should name the offers the catalogue no longer describes, once', () => {
    expect(unresolvedOfferIdsOf([...lines, working({ key: 'd', offerIds: [99] })], CATALOG)).toEqual([99])
    expect(unresolvedOfferIdsOf([working({ isHidden: true, offerIds: [99] })], CATALOG)).toEqual([])
  })
})

describe('groupedByRubric', () => {
  it('should group in display order and leave an empty rubric out', () => {
    const published: PublishedRecommendationPayload[] = [
      { rubric: RecommendationRubric.WEALTH, theme: 'W', offers: [] },
      { rubric: RecommendationRubric.MANAGEMENT, theme: 'M', offers: [] },
      { rubric: RecommendationRubric.WEALTH, theme: 'W2', offers: [] },
    ]

    expect(groupedByRubric(published)).toEqual([
      { rubric: RecommendationRubric.MANAGEMENT, recommendations: [published[1]] },
      { rubric: RecommendationRubric.WEALTH, recommendations: [published[0], published[2]] },
    ])
  })
})

describe('compareRecommendations', () => {
  const published: PublishedRecommendationPayload[] = [
    { rubric: RecommendationRubric.MANAGEMENT, theme: 'T', observations: 'O', offers: [{ offerId: 10, title: 'A' }] },
    { rubric: RecommendationRubric.SOCIAL, theme: 'S', offers: [] },
  ]

  it('should count nothing when the two sides read alike, the wording of the offers ignored', () => {
    const current = structuredClone(published)

    current[0].offers[0].title = 'Renommée au catalogue'
    current[1].risk = ''

    expect(compareRecommendations(published, current)).toBe(0)
  })

  it('should count each line that changed, went, came or moved', () => {
    expect(compareRecommendations(published, [{ ...published[0], rubric: RecommendationRubric.SECTOR }, published[1]])).toBe(1)
    expect(compareRecommendations(published, [published[0]])).toBe(1)
    expect(compareRecommendations(published, [...published, { ...published[1], theme: 'N' }])).toBe(1)
    expect(compareRecommendations(published, [published[1], published[0]])).toBe(1)
  })

  /** Hiding one line shifts every line after it: none of them changed for the client. */
  it('should count a line taken out of the middle once, whatever follows it', () => {
    const many: PublishedRecommendationPayload[] = Array.from({ length: 12 }, (_, rank) => ({
      rubric: RecommendationRubric.MANAGEMENT,
      theme: `T${rank}`,
      offers: [],
    }))

    expect(compareRecommendations(many, [...many.slice(0, 2), ...many.slice(3)])).toBe(1)
    expect(compareRecommendations(many, [many[0], ...many.slice(2, 5), ...many.slice(6, 9), ...many.slice(10)])).toBe(3)
  })
})
