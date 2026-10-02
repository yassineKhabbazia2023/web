import PptxGenJS from 'pptxgenjs'
import { ExportManager } from './export.manager'
import { PdfDeck } from './export.pdf'
import { RecommendationPriority, RecommendationRubric, Renderer, Trend } from '../enums/key-moments.enums'
import type { Card, Widget } from '../types/key-moments.types'
import type { PublishedRecommendationPayload } from '../types/recommendations.types'
import type { DeckDocument, DeckLabels, SlideRow, SlideSurface } from './export.types'

/** What one slide was asked to draw, the only thing the manager produces. */
interface RecordedSlide {
  background?: { color: string }
  texts: string[]
  images: { data: string, x: number, y: number, w: number, h: number }[]
  tables: { rows: { text: unknown }[][], options: Record<string, unknown> }[]
  shapes: number
}

const DECK_BLOB = new Blob(['deck'])

let recorded: RecordedSlide[]

/**
 * `addText` and a table cell both take a string or the runs of a rich
 * paragraph. A run asking for a break really is a new line — which is the whole
 * point of writing a two-line header as two runs — so it is read back as one.
 */
function readText(text: unknown): string {
  if (Array.isArray(text) === false) {
    return String(text)
  }

  return (text as { text: string, options?: { breakLine?: boolean } }[])
    .map(run => (run.options?.breakLine === true ? `${run.text}\n` : run.text))
    .join('')
}

function recordSlide(): unknown {
  const slide: RecordedSlide = { texts: [], images: [], tables: [], shapes: 0 }
  recorded.push(slide)

  return {
    set background(value: { color: string }) {
      slide.background = value
    },
    addText: (text: unknown) => slide.texts.push(readText(text)),
    addImage: (options: RecordedSlide['images'][number]) => slide.images.push(options),
    addTable: (rows: { text: unknown }[][], options: Record<string, unknown>) =>
      slide.tables.push({ rows, options }),
    addShape: () => {
      slide.shapes += 1
    },
  }
}

/**
 * The manager builds its deck with `new`, and the mocked constructor hands back
 * an instance of its own prototype: that is where the recorder is installed.
 */
beforeEach(() => {
  recorded = []

  Object.assign(vi.mocked(PptxGenJS).prototype, {
    addSlide: recordSlide,
    write: () => Promise.resolve(DECK_BLOB),
  })
})

function makeWidget(
  id: string,
  span: number,
  renderer: Renderer,
  parts: Partial<Widget> = {},
): Widget {
  return {
    id,
    title: `Widget ${id}`,
    comment: '',
    span,
    renderer,
    availableRenderers: [renderer],
    isHidden: false,
    isCommentHidden: true,
    ...parts,
  }
}

const TABLE_VIEW = {
  columns: [
    { key: 'n', title: 'N', caption: '12/2025', isVariation: false },
    { key: 'var', title: 'Var.', isVariation: true },
  ],
  rows: [
    {
      id: 'ca',
      label: "Chiffre d'affaires",
      cells: {
        n: { value: '1 240 000 €', trend: Trend.NEUTRAL },
        var: { value: '+8,2 %', trend: Trend.POSITIVE },
      },
    },
    {
      id: 'marge',
      label: 'Marge brute',
      cells: {
        n: { value: '420 000 €', trend: Trend.NEUTRAL },
        var: { value: '-3,1 %', trend: Trend.NEGATIVE },
      },
    },
  ],
}

const CARD: Card = {
  id: 'treso',
  title: 'Trésorerie',
  value: '154 453 €',
  trend: Trend.POSITIVE,
  isSignColored: false,
  isHighlighted: false,
  isHidden: false,
}

const TABLE_WIDGET = makeWidget('ca', 12, Renderer.TABLE, { table: TABLE_VIEW })
const CARDS_WIDGET = makeWidget('cards', 6, Renderer.CARDS, { cards: [CARD] })
const CHART_WIDGET = makeWidget('chart', 6, Renderer.CHART)

const LABELS: DeckLabels = {
  title: 'Moments clés',
  entityName: 'Boulangerie Martin',
  caption: ['Boulangerie Martin (SIRET 123 456 789 00015)', 'affichage en k€'],
  lineLabel: 'Indicateur',
  assets: 'Actif',
  liabilities: 'Passif',
  narrativeStart: 'Au départ',
  narrativeEnd: 'À l\'arrivée',
  variation: 'Variation',
  comment: 'Commentaire',
  continued: '(suite)',
  recommendationsTitle: 'Nos recommandations',
  recommendationsSubtitle: 'Nos préconisations pour l\'exercice à venir',
  priorities: {
    [RecommendationPriority.PRIMARY]: 'Prioritaire',
    [RecommendationPriority.SIGNIFICANT]: 'Significatif',
    [RecommendationPriority.INFORMATIVE]: 'Informatif',
  },
  rubrics: {
    [RecommendationRubric.MANAGEMENT]: 'Gestion',
    [RecommendationRubric.ACCOUNTING]: 'Comptables, fiscales et financières',
    [RecommendationRubric.SECTOR]: 'Propres à votre secteur',
    [RecommendationRubric.SOCIAL]: 'Gestion sociale',
    [RecommendationRubric.WEALTH]: 'Patrimoniales',
  },
  observations: 'Observations',
  risk: 'Risque',
  recommendation: 'Recommandation',
  offers: 'Offres',
}

const ROWS: SlideRow[] = [
  {
    head: { rank: '01', title: 'Santé financière', subtitle: 'Vos chiffres clés' },
    widgets: [{ widget: TABLE_WIDGET }],
  },
  {
    head: { rank: '02', title: 'Trésorerie' },
    widgets: [
      { widget: CARDS_WIDGET },
      { widget: CHART_WIDGET, image: 'data:image/png;base64,chart', aspectRatio: 0.6 },
    ],
  },
]

describe('ExportManager.buildDeck', () => {
  it('should open the deck on a cover stating how the report is read', async () => {
    await ExportManager.buildDeck(LABELS, ROWS, [])

    const [cover] = recorded

    expect(cover.texts).toEqual([
      'MOMENTS CLÉS',
      'Boulangerie Martin',
      'Boulangerie Martin (SIRET 123 456 789 00015)\naffichage en k€',
    ])
    expect(cover.images).toEqual([])
    expect(cover.tables).toEqual([])
  })

  it('should add one slide per grid row after the cover', async () => {
    await ExportManager.buildDeck(LABELS, ROWS, [])

    expect(recorded).toHaveLength(3)
  })

  /**
   * The heading of a section, as the page draws it: its ordinal, its overline,
   * then its title — written, never uppercased, since the page is not.
   */
  it('should announce the section a slide belongs to, and its rank', async () => {
    await ExportManager.buildDeck(LABELS, ROWS, [])

    expect(recorded[1].texts).toContain('01')
    expect(recorded[1].texts).toContain('VOS CHIFFRES CLÉS')
    expect(recorded[1].texts).toContain('Santé financière')
    expect(recorded[1].texts).toContain('1/2')
    expect(recorded[2].texts).toContain('02')
    expect(recorded[2].texts).toContain('Trésorerie')
    expect(recorded[2].texts).toContain('2/2')
  })

  /** A section without an overline is announced by its title alone. */
  it('should write no overline for a section the template names none for', async () => {
    await ExportManager.buildDeck(LABELS, ROWS, [])

    expect(recorded[2].texts).not.toContain('VOS CHIFFRES CLÉS')
  })

  it('should write a table widget as a table, never as a picture', async () => {
    await ExportManager.buildDeck(LABELS, ROWS, [])

    const [table] = recorded[1].tables

    expect(recorded[1].images).toEqual([])
    // The header, then one row per line the widget reads
    expect(table.rows).toHaveLength(3)
    expect(table.rows[0].map(cell => readText(cell.text)))
      .toEqual(['INDICATEUR', 'N\n12/2025', 'Var.'])
    expect(table.rows[1].map(cell => readText(cell.text)))
      .toEqual(["Chiffre d'affaires", '1 240 000 €', '+8,2 %'])
  })

  it('should size the columns of a table so that no figure has to wrap', async () => {
    await ExportManager.buildDeck(LABELS, ROWS, [])

    const [table] = recorded[1].tables
    const widths = table.options.colW as number[]

    // One width per column, the labels taking whatever the figures leave
    expect(widths).toHaveLength(3)
    expect(widths.reduce((total, width) => total + width, 0))
      .toBeCloseTo(table.options.w as number)
    expect(widths[0]).toBeGreaterThan(widths[1])
  })

  it('should write the title of every widget as text', async () => {
    await ExportManager.buildDeck(LABELS, ROWS, [])

    expect(recorded[1].texts).toContain('Widget ca')
    expect(recorded[2].texts).toContain('Widget cards')
    expect(recorded[2].texts).toContain('Widget chart')
  })

  it('should write the figures of a card as text', async () => {
    await ExportManager.buildDeck(LABELS, ROWS, [])

    expect(recorded[2].texts).toContain('TRÉSORERIE')
    expect(recorded[2].texts).toContain('154 453 €')
  })

  it('should hand a drawing over as the picture it is', async () => {
    await ExportManager.buildDeck(LABELS, ROWS, [])

    const [image] = recorded[2].images

    expect(image.data).toBe('data:image/png;base64,chart')
    // A drawing keeps its shape: the height follows the width it was given
    expect(image.h / image.w).toBeCloseTo(0.6)
  })

  it('should write the editorial slot of a widget that shows one', async () => {
    await ExportManager.buildDeck(LABELS, [{
      head: { rank: '01', title: 'Santé financière' },
      widgets: [{
        widget: makeWidget('ca', 12, Renderer.TABLE, {
          table: TABLE_VIEW,
          comment: 'La marge se tient.',
          isCommentHidden: false,
        }),
      }],
    }], [])

    expect(recorded[1].texts).toContain('COMMENTAIRE\nLa marge se tient.')
  })

  it('should paint every slide on the canvas of the report', async () => {
    await ExportManager.buildDeck(LABELS, ROWS, [])

    expect(recorded.every(slide => slide.background !== undefined)).toBe(true)
  })

  it('should produce a cover alone when the report has no row', async () => {
    await ExportManager.buildDeck(LABELS, [], [])

    expect(recorded).toHaveLength(1)
  })

  it('should return the written deck', async () => {
    await expect(ExportManager.buildDeck(LABELS, ROWS, [])).resolves.toBe(DECK_BLOB)
  })
})

/**
 * The recommendations close the deck. Written rather than captured, one rubric
 * per slide, and only what the client would read: the projection handed in is
 * the visible one already.
 */
describe('ExportManager.buildDeck — the recommendations', () => {
  const RECOMMENDATION: PublishedRecommendationPayload = {
    rubric: RecommendationRubric.MANAGEMENT,
    theme: 'Trésorerie',
    priority: RecommendationPriority.PRIMARY,
    observations: 'Aucun plan de trésorerie formalisé.',
    risk: 'Une tension de trésorerie non anticipée.',
    recommendation: 'Bâtir un plan de trésorerie glissant à 12 mois.',
    offers: [{ offerId: 128, title: 'Pack Prévoyance TNS' }, { offerId: 129, title: 'Tableau de bord' }],
  }
  const RUBRIC: PublishedRecommendationPayload[] = [RECOMMENDATION]

  it('should add no slide at all when nothing is visible', async () => {
    await ExportManager.buildDeck(LABELS, ROWS, [])

    expect(recorded).toHaveLength(3)
  })

  /** They close the report, so they are numbered after the sections it carries. */
  it('should number the recommendations after the last section', async () => {
    await ExportManager.buildDeck(LABELS, ROWS, RUBRIC)

    expect(recorded.at(-1)!.texts).toContain('03')
    expect(recorded.at(-1)!.texts).toContain(LABELS.recommendationsSubtitle.toUpperCase())
  })

  it('should number the recommendations after the last ordinal written, never off the count', async () => {
    const rows: SlideRow[] = [
      { head: { rank: '01', title: 'Santé financière' }, widgets: [{ widget: TABLE_WIDGET }] },
      { head: { rank: '03', title: 'Trésorerie' }, widgets: [{ widget: CARDS_WIDGET }] },
    ]

    await ExportManager.buildDeck(LABELS, rows, RUBRIC)

    expect(recorded.at(-1)!.texts).toContain('04')
  })

  it('should write the rubric, the theme with its priority, the three texts and the offers on one line', async () => {
    await ExportManager.buildDeck(LABELS, ROWS, RUBRIC)

    const { texts, images } = recorded.at(-1)!

    expect(images).toEqual([])
    expect(texts).toContain('Nos recommandations')
    expect(texts).toContain('Gestion')
    expect(texts).toContain('Trésorerie · Prioritaire')
    expect(texts).toContain(LABELS.observations)
    expect(texts).toContain('Aucun plan de trésorerie formalisé.')
    expect(texts).toContain(LABELS.risk)
    expect(texts).toContain(LABELS.recommendation)
    expect(texts).toContain('Bâtir un plan de trésorerie glissant à 12 mois.')
    expect(texts).toContain('Offres : Pack Prévoyance TNS · Tableau de bord')
  })

  it('should leave an empty block out, its heading with it, and write no priority when there is none', async () => {
    await ExportManager.buildDeck(LABELS, ROWS, [{ ...RECOMMENDATION, priority: undefined, observations: undefined, offers: [] }])

    const { texts } = recorded.at(-1)!

    expect(texts).toContain('Trésorerie')
    expect(texts).not.toContain(LABELS.observations)
    expect(texts).toContain(LABELS.risk)
    expect(texts.some(text => text.startsWith('Offres'))).toBe(false)
  })

  it('should give every rubric its own slide, and continue an overflowing one under the same title', async () => {
    const long: PublishedRecommendationPayload[] = Array.from({ length: 5 }, (_, rank) => ({
      ...RECOMMENDATION,
      rubric: RecommendationRubric.SOCIAL,
      theme: `Thème ${rank}`,
    }))

    await ExportManager.buildDeck(LABELS, ROWS, [...RUBRIC, ...long])

    expect(recorded).toHaveLength(3 + 1 + 3)
    expect(recorded[4].texts).toContain('Gestion sociale')
    expect(recorded[5].texts).toContain('Nos recommandations (suite)')
    expect(recorded[5].texts).toContain('Gestion sociale')
  })

  it('should count the recommendation slides in the pagination', async () => {
    await ExportManager.buildDeck(LABELS, ROWS, RUBRIC)

    expect(recorded[1].texts).toContain('1/3')
    expect(recorded.at(-1)!.texts).toContain('3/3')
  })
})

describe('ExportManager.paginateRecommendations', () => {
  const recommendation = (theme: string, rubric = RecommendationRubric.MANAGEMENT): PublishedRecommendationPayload => (
    { rubric, theme, offers: [] }
  )

  it('should put a short rubric on one slide, named by its label', () => {
    const slides = ExportManager.paginateRecommendations([recommendation('1')], 2, LABELS.rubrics)

    expect(slides).toEqual([{ label: 'Gestion', recommendations: [recommendation('1')], isContinued: false }])
  })

  it('should continue an overflowing rubric on the next slides, in order', () => {
    const slides = ExportManager.paginateRecommendations(['1', '2', '3', '4', '5'].map(theme => recommendation(theme)), 2, LABELS.rubrics)

    expect(slides.map(slide => slide.recommendations.map(item => item.theme))).toEqual([['1', '2'], ['3', '4'], ['5']])
    expect(slides.map(slide => slide.isContinued)).toEqual([false, true, true])
  })

  it('should never share a slide between two rubrics, and draw none for an empty one', () => {
    const slides = ExportManager.paginateRecommendations([
      recommendation('2', RecommendationRubric.WEALTH),
      recommendation('1'),
    ], 2, LABELS.rubrics)

    expect(slides.map(slide => slide.label)).toEqual(['Gestion', 'Patrimoniales'])
  })
})

/**
 * The PDF is the deck on other paper: the pages are composed once, and the
 * format only settles the document they are drawn into.
 */
describe('ExportManager.buildPdf', () => {
  const PDF_BLOB = new Blob(['pdf'])

  const RUBRICS: PublishedRecommendationPayload[] = [
    { rubric: RecommendationRubric.MANAGEMENT, theme: 'Trésorerie', priority: RecommendationPriority.PRIMARY, recommendation: 'Un plan.', offers: [] },
  ]

  const PDF_DOCUMENT: DeckDocument = {
    addPage: () => recordSlide() as SlideSurface,
    toBlob: () => Promise.resolve(PDF_BLOB),
  }

  beforeEach(() => {
    // doctrine: static-classes — the document factory is stubbed on the real
    // class, never module-mocked.
    vi.spyOn(PdfDeck, 'create').mockResolvedValue(PDF_DOCUMENT as PdfDeck)
  })

  it('should write page for page what the deck writes', async () => {
    await ExportManager.buildDeck(LABELS, ROWS, RUBRICS)

    const deckPages = recorded.map(slide => slide.texts)

    recorded = []

    await ExportManager.buildPdf(LABELS, ROWS, RUBRICS)

    expect(recorded.map(slide => slide.texts)).toEqual(deckPages)
  })

  it('should draw a table as a table and a chart as the picture it is', async () => {
    await ExportManager.buildPdf(LABELS, ROWS, [])

    expect(recorded[1].tables).toHaveLength(1)
    expect(recorded[2].images).toHaveLength(1)
  })

  it('should return the written PDF', async () => {
    await expect(ExportManager.buildPdf(LABELS, ROWS, [])).resolves.toBe(PDF_BLOB)
  })
})
