import PptxGenJS from 'pptxgenjs'
import { ExportManager } from './export.manager'
import { PdfDeck } from './export.pdf'
import { OfferPriority, Renderer, Trend } from '../enums/key-moments.enums'
import type {
  Card,
  LinkedOffer,
  Report,
  Widget,
} from '../types/key-moments.types'
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

const REPORT: Report = {
  entity: { name: 'Boulangerie Martin', legalForm: 'SARL', siret: '12345678900015' },
  screens: [],
}

const LABELS: DeckLabels = {
  title: 'Moments clés',
  caption: ['Boulangerie Martin (SIRET 123 456 789 00015)', 'affichage en k€'],
  lineLabel: 'Indicateur',
  assets: 'Actif',
  liabilities: 'Passif',
  narrativeStart: 'Au départ',
  narrativeEnd: 'À l\'arrivée',
  variation: 'Variation',
  comment: 'Commentaire',
  continued: '(suite)',
  offersTitle: 'Nos recommandations',
  offersSubtitle: 'Nos préconisations pour l\'exercice à venir',
  offerPriorities: {
    [OfferPriority.PRIMARY]: 'Prioritaire',
    [OfferPriority.SIGNIFICANT]: 'Significatif',
    [OfferPriority.INFORMATIVE]: 'Informatif',
  },
  offerComment: 'Pourquoi nous vous recommandons cette offre ?',
  offerBenefitsComment: 'Bénéfices pour votre entreprise',
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
    await ExportManager.buildDeck(REPORT, LABELS, ROWS)

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
    await ExportManager.buildDeck(REPORT, LABELS, ROWS)

    expect(recorded).toHaveLength(3)
  })

  /**
   * The heading of a section, as the page draws it: its ordinal, its overline,
   * then its title — written, never uppercased, since the page is not.
   */
  it('should announce the section a slide belongs to, and its rank', async () => {
    await ExportManager.buildDeck(REPORT, LABELS, ROWS)

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
    await ExportManager.buildDeck(REPORT, LABELS, ROWS)

    expect(recorded[2].texts).not.toContain('VOS CHIFFRES CLÉS')
  })

  it('should write a table widget as a table, never as a picture', async () => {
    await ExportManager.buildDeck(REPORT, LABELS, ROWS)

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
    await ExportManager.buildDeck(REPORT, LABELS, ROWS)

    const [table] = recorded[1].tables
    const widths = table.options.colW as number[]

    // One width per column, the labels taking whatever the figures leave
    expect(widths).toHaveLength(3)
    expect(widths.reduce((total, width) => total + width, 0))
      .toBeCloseTo(table.options.w as number)
    expect(widths[0]).toBeGreaterThan(widths[1])
  })

  it('should write the title of every widget as text', async () => {
    await ExportManager.buildDeck(REPORT, LABELS, ROWS)

    expect(recorded[1].texts).toContain('Widget ca')
    expect(recorded[2].texts).toContain('Widget cards')
    expect(recorded[2].texts).toContain('Widget chart')
  })

  it('should write the figures of a card as text', async () => {
    await ExportManager.buildDeck(REPORT, LABELS, ROWS)

    expect(recorded[2].texts).toContain('TRÉSORERIE')
    expect(recorded[2].texts).toContain('154 453 €')
  })

  it('should hand a drawing over as the picture it is', async () => {
    await ExportManager.buildDeck(REPORT, LABELS, ROWS)

    const [image] = recorded[2].images

    expect(image.data).toBe('data:image/png;base64,chart')
    // A drawing keeps its shape: the height follows the width it was given
    expect(image.h / image.w).toBeCloseTo(0.6)
  })

  it('should write the editorial slot of a widget that shows one', async () => {
    await ExportManager.buildDeck(REPORT, LABELS, [{
      head: { rank: '01', title: 'Santé financière' },
      widgets: [{
        widget: makeWidget('ca', 12, Renderer.TABLE, {
          table: TABLE_VIEW,
          comment: 'La marge se tient.',
          isCommentHidden: false,
        }),
      }],
    }])

    expect(recorded[1].texts).toContain('COMMENTAIRE\nLa marge se tient.')
  })

  it('should paint every slide on the canvas of the report', async () => {
    await ExportManager.buildDeck(REPORT, LABELS, ROWS)

    expect(recorded.every(slide => slide.background !== undefined)).toBe(true)
  })

  it('should produce a cover alone when the report has no row', async () => {
    await ExportManager.buildDeck(REPORT, LABELS, [])

    expect(recorded).toHaveLength(1)
  })

  it('should return the written deck', async () => {
    await expect(ExportManager.buildDeck(REPORT, LABELS, ROWS)).resolves.toBe(DECK_BLOB)
  })
})

/**
 * The recommendations close the deck. Written rather than captured, and read
 * off the same rule the widgets are: only what would be published.
 */
describe('ExportManager.buildDeck — the recommendations', () => {
  const OFFER: LinkedOffer = {
    offerId: 128,
    title: 'Pack Prévoyance TNS',
    shortDescription: 'Couverture des indépendants',
    categoryName: 'Protection sociale',
    comment: 'Adapté à votre passage en SASU',
    benefitsComment: 'Une couverture sans reste à charge',
    priority: OfferPriority.PRIMARY,
    isPriorityVisible: true,
    isHidden: false,
    isRetired: false,
  }

  it('should add no slide at all when nothing is attached', async () => {
    await ExportManager.buildDeck(REPORT, LABELS, ROWS, [])

    expect(recorded).toHaveLength(3)
  })

  /** They close the report, so they are numbered after the sections it carries. */
  it('should number the recommendations after the last section', async () => {
    await ExportManager.buildDeck(REPORT, LABELS, ROWS, [OFFER])

    expect(recorded.at(-1)!.texts).toContain('03')
    expect(recorded.at(-1)!.texts).toContain(LABELS.offersSubtitle.toUpperCase())
  })

  /**
   * A section whose every widget is hidden draws no slide, but the sections
   * after it keep the ordinal the client will read them by: numbering the
   * recommendations off how many slides were drawn would hand them a number a
   * section already carries.
   */
  it('should number the recommendations after the last ordinal written, never off the count', async () => {
    const rows: SlideRow[] = [
      { head: { rank: '01', title: 'Santé financière' }, widgets: [{ widget: TABLE_WIDGET }] },
      { head: { rank: '03', title: 'Trésorerie' }, widgets: [{ widget: CARDS_WIDGET }] },
    ]

    await ExportManager.buildDeck(REPORT, LABELS, rows, [OFFER])

    expect(recorded.at(-1)!.texts).toContain('04')
  })

  it('should close the deck on a recommendations slide', async () => {
    await ExportManager.buildDeck(REPORT, LABELS, ROWS, [OFFER])

    expect(recorded).toHaveLength(4)
    expect(recorded.at(-1)!.texts).toContain('Nos recommandations')
  })

  /** The note is text the reader can select and correct, never a picture. */
  it('should write the note rather than capture it', async () => {
    await ExportManager.buildDeck(REPORT, LABELS, ROWS, [OFFER])

    const slide = recorded.at(-1)!

    expect(slide.texts).toContain('Adapté à votre passage en SASU')
    expect(slide.images).toEqual([])
  })

  it('should write the title and the category of each recommendation', async () => {
    await ExportManager.buildDeck(REPORT, LABELS, ROWS, [OFFER])

    const slide = recorded.at(-1)!

    expect(slide.texts).toContain('Pack Prévoyance TNS')
    expect(slide.texts).toContain('PROTECTION SOCIALE')
  })

  /**
   * The deck is internal: telling the firm what it decided is never the same
   * question as telling the client.
   */
  it('should write the degree even when it is kept from the client', async () => {
    await ExportManager.buildDeck(REPORT, LABELS, ROWS, [
      { ...OFFER, isPriorityVisible: false },
    ])

    expect(recorded.at(-1)!.texts).toContain('Prioritaire')
  })

  it('should leave the hidden ones out, as it leaves out a hidden sub-section', async () => {
    await ExportManager.buildDeck(REPORT, LABELS, ROWS, [
      { ...OFFER, isHidden: true },
    ])

    expect(recorded).toHaveLength(3)
  })

  it('should write both notes under their headings, and not the short description', async () => {
    await ExportManager.buildDeck(REPORT, LABELS, ROWS, [OFFER])

    const { texts } = recorded.at(-1)!

    expect(texts).toContain(LABELS.offerComment)
    expect(texts).toContain('Adapté à votre passage en SASU')
    expect(texts).toContain(LABELS.offerBenefitsComment)
    expect(texts).toContain('Une couverture sans reste à charge')
    expect(texts).not.toContain('Couverture des indépendants')
  })

  it('should write the one note written, without the heading of the other', async () => {
    await ExportManager.buildDeck(REPORT, LABELS, ROWS, [
      { ...OFFER, comment: undefined },
    ])

    const { texts } = recorded.at(-1)!

    expect(texts).toContain(LABELS.offerBenefitsComment)
    expect(texts).toContain('Une couverture sans reste à charge')
    expect(texts).not.toContain(LABELS.offerComment)
  })

  it('should fall back on the short description when nothing was written', async () => {
    await ExportManager.buildDeck(REPORT, LABELS, ROWS, [
      { ...OFFER, comment: undefined, benefitsComment: undefined },
    ])

    const { texts } = recorded.at(-1)!

    expect(texts).toContain('Couverture des indépendants')
    expect(texts).not.toContain(LABELS.offerComment)
  })

  it('should spread five recommendations over two slides, the second marked as a continuation', async () => {
    const offers = Array.from({ length: 5 }, (_, rank) => ({ ...OFFER, offerId: rank + 1 }))

    await ExportManager.buildDeck(REPORT, LABELS, ROWS, offers)

    expect(recorded).toHaveLength(5)
    expect(recorded.at(-1)!.texts).toContain('Nos recommandations (suite)')
  })

  /** A deck whose last page says 3/3 while carrying five would be lying. */
  it('should count the recommendation slides in the pagination', async () => {
    await ExportManager.buildDeck(REPORT, LABELS, ROWS, [OFFER])

    expect(recorded[1].texts).toContain('1/3')
    expect(recorded.at(-1)!.texts).toContain('3/3')
  })
})

/**
 * The PDF is the deck on other paper: the pages are composed once, and the
 * format only settles the document they are drawn into.
 */
describe('ExportManager.buildPdf', () => {
  const PDF_BLOB = new Blob(['pdf'])

  const OFFER: LinkedOffer = {
    offerId: 128,
    title: 'Pack Prévoyance TNS',
    priority: OfferPriority.PRIMARY,
    isPriorityVisible: true,
    isHidden: false,
    isRetired: false,
  }

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
    await ExportManager.buildDeck(REPORT, LABELS, ROWS, [OFFER])

    const deckPages = recorded.map(slide => slide.texts)

    recorded = []

    await ExportManager.buildPdf(REPORT, LABELS, ROWS, [OFFER])

    expect(recorded.map(slide => slide.texts)).toEqual(deckPages)
  })

  it('should draw a table as a table and a chart as the picture it is', async () => {
    await ExportManager.buildPdf(REPORT, LABELS, ROWS)

    expect(recorded[1].tables).toHaveLength(1)
    expect(recorded[2].images).toHaveLength(1)
  })

  it('should return the written PDF', async () => {
    await expect(ExportManager.buildPdf(REPORT, LABELS, ROWS)).resolves.toBe(PDF_BLOB)
  })
})
