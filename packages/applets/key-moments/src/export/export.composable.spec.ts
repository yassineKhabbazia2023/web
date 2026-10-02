import { nextTick } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { logger } from '@pulse/toolbox'
import { downloadFile } from '@pulse/common/helpers'
import { displayNotification } from '@pulse/styleguide'
import { useExport } from './export.composable'
import { ExportManager } from './export.manager'
import { readReport } from './export.utils'
import { ExportFormat, RecommendationPriority, RecommendationRubric, Renderer } from '../enums/key-moments.enums'
import type { Report } from '../types/key-moments.types'
import type { SlideRow } from './export.types'

const REPORT: Report = {
  entity: { name: 'Boulangerie Martin', legalForm: 'SARL', siret: '12345678900015' },
  screens: [],
}

/** Deliberately not the name the closing carries: the cover names the dossier. */
const ENTITY_NAME = 'BOULANGERIE MARTIN SARL'

const CAPTION = ['Boulangerie Martin (SIRET 123 456 789 00015)']

const ROWS: SlideRow[] = [{
  head: { rank: '01', title: 'Santé financière' },
  widgets: [{
    widget: {
      id: 'ca',
      title: "Chiffre d'affaires",
      comment: '',
      span: 12,
      renderer: Renderer.TABLE,
      availableRenderers: [Renderer.TABLE],
      isHidden: false,
      isCommentHidden: true,
    },
  }],
}]

const DECK_BLOB = new Blob(['deck'])
const PDF_BLOB = new Blob(['pdf'])

beforeEach(() => {
  vi.mocked(readReport).mockResolvedValue(ROWS)
  // doctrine: static-classes — a class manager is stubbed with a per-test spy,
  // never a module mock.
  vi.spyOn(ExportManager, 'buildDeck').mockResolvedValue(DECK_BLOB)
  vi.spyOn(ExportManager, 'buildPdf').mockResolvedValue(PDF_BLOB)
  vi.mocked(downloadFile).mockImplementation(() => {})
})

describe('useExport', () => {
  it('should download the deck built from what the page displays', async () => {
    const { exportReport } = useExport()

    await exportReport(ExportFormat.PPTX, REPORT, ENTITY_NAME, CAPTION, [])

    expect(vi.mocked(readReport)).toHaveBeenCalledWith(REPORT)
    expect(ExportManager.buildDeck).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'keyMoments.title', entityName: ENTITY_NAME, caption: CAPTION }),
      ROWS,
      [],
    )
    expect(vi.mocked(downloadFile)).toHaveBeenCalledWith(DECK_BLOB, 'moments-cles-12345678900015.pptx')
  })

  /** One dossier, one file per exercice: two exports must not share a name. */
  it('should name the file after the exercice when it is given one', async () => {
    const { exportReport } = useExport()

    await exportReport(ExportFormat.PDF, REPORT, ENTITY_NAME, CAPTION, [], '2025')

    expect(vi.mocked(downloadFile))
      .toHaveBeenCalledWith(PDF_BLOB, 'moments-cles-12345678900015-2025.pdf')
  })

  /** The same report, the same rows, the same words — only the file differs. */
  it('should download the PDF built from the very same reading', async () => {
    const { exportReport } = useExport()

    await exportReport(ExportFormat.PDF, REPORT, ENTITY_NAME, CAPTION, [])

    expect(ExportManager.buildDeck).not.toHaveBeenCalled()
    expect(ExportManager.buildPdf).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'keyMoments.title', entityName: ENTITY_NAME, caption: CAPTION }),
      ROWS,
      [],
    )
    expect(vi.mocked(downloadFile)).toHaveBeenCalledWith(PDF_BLOB, 'moments-cles-12345678900015.pdf')
  })

  it('should hand the deck every word only the page can translate', async () => {
    const { exportReport } = useExport()

    await exportReport(ExportFormat.PPTX, REPORT, ENTITY_NAME, CAPTION, [])

    // The identity `t` of the test setup hands the keys back untranslated
    expect(vi.mocked(ExportManager.buildDeck).mock.calls[0][0]).toEqual({
      title: 'keyMoments.title',
      entityName: ENTITY_NAME,
      caption: CAPTION,
      lineLabel: 'keyMoments.table.label',
      assets: 'keyMoments.balanceSheet.assets',
      liabilities: 'keyMoments.balanceSheet.liabilities',
      narrativeStart: 'keyMoments.narrative.start',
      narrativeEnd: 'keyMoments.narrative.end',
      variation: 'keyMoments.cards.variation',
      comment: 'keyMoments.comment.title',
      continued: 'keyMoments.export.continued',
      recommendationsTitle: 'keyMoments.recommendations.title',
      recommendationsSubtitle: 'keyMoments.recommendations.subtitle',
      priorities: {
        [RecommendationPriority.PRIMARY]: 'keyMoments.recommendations.priority.primary',
        [RecommendationPriority.SIGNIFICANT]: 'keyMoments.recommendations.priority.significant',
        [RecommendationPriority.INFORMATIVE]: 'keyMoments.recommendations.priority.informative',
      },
      rubrics: {
        [RecommendationRubric.MANAGEMENT]: 'keyMoments.recommendations.rubrics.management',
        [RecommendationRubric.ACCOUNTING]: 'keyMoments.recommendations.rubrics.accounting',
        [RecommendationRubric.SECTOR]: 'keyMoments.recommendations.rubrics.sector',
        [RecommendationRubric.SOCIAL]: 'keyMoments.recommendations.rubrics.social',
        [RecommendationRubric.WEALTH]: 'keyMoments.recommendations.rubrics.wealth',
      },
      observations: 'keyMoments.recommendations.customer.observations',
      risk: 'keyMoments.recommendations.customer.risk',
      recommendation: 'keyMoments.recommendations.customer.recommendation',
      offers: 'keyMoments.recommendations.export.offers',
    })
  })

  /** The rubrics travel as the client was served them: visible ones only, already projected. */
  it('should hand the recommendations over as the client was served them', async () => {
    const { exportReport } = useExport()
    const rubrics = [
      { rubric: RecommendationRubric.MANAGEMENT, theme: 'Trésorerie', priority: RecommendationPriority.PRIMARY, recommendation: 'Un plan.', offers: [] },
    ]

    await exportReport(ExportFormat.PPTX, REPORT, ENTITY_NAME, CAPTION, rubrics)

    expect(vi.mocked(ExportManager.buildDeck).mock.calls[0][2]).toBe(rubrics)
  })

  /** A report served without the section produces a file without one. */
  it('should write no recommendation when the client was served none', async () => {
    const { exportReport } = useExport()

    await exportReport(ExportFormat.PPTX, REPORT, ENTITY_NAME, CAPTION, [])

    expect(vi.mocked(ExportManager.buildDeck).mock.calls[0][2]).toEqual([])
  })

  it('should report which format is being exported until it is downloaded', async () => {
    const { isExportingDeck, isExportingPdf, exportReport } = useExport()

    expect(isExportingDeck.value).toBe(false)

    const done = exportReport(ExportFormat.PPTX, REPORT, ENTITY_NAME, CAPTION, [])
    await nextTick()

    expect(isExportingDeck.value).toBe(true)
    expect(isExportingPdf.value).toBe(false)

    await done

    expect(isExportingDeck.value).toBe(false)
  })

  /** One export at a time, whatever the format the second one asks for. */
  it('should ignore an export asked for while one is running', async () => {
    const { exportReport } = useExport()

    const done = exportReport(ExportFormat.PPTX, REPORT, ENTITY_NAME, CAPTION, [])
    await exportReport(ExportFormat.PDF, REPORT, ENTITY_NAME, CAPTION, [])
    await done

    expect(vi.mocked(readReport)).toHaveBeenCalledOnce()
    expect(ExportManager.buildPdf).not.toHaveBeenCalled()
  })

  it('should warn the reader when the capture fails, and let them retry', async () => {
    const failure = new Error('capture failed')
    vi.mocked(readReport).mockRejectedValueOnce(failure)

    const { isExportingDeck, exportReport } = useExport()

    await exportReport(ExportFormat.PPTX, REPORT, ENTITY_NAME, CAPTION, [])
    await flushPromises()

    expect(vi.mocked(logger.error)).toHaveBeenCalledWith(
      '[KeyMoments] unable to export the report as a pptx file',
      failure,
    )
    expect(vi.mocked(displayNotification))
      .toHaveBeenCalledWith('error', 'keyMoments.export.error.pptx')
    expect(vi.mocked(downloadFile)).not.toHaveBeenCalled()
    expect(isExportingDeck.value).toBe(false)
  })

  it('should name the PDF failure by its own format', async () => {
    vi.mocked(readReport).mockRejectedValueOnce(new Error('capture failed'))

    const { exportReport } = useExport()

    await exportReport(ExportFormat.PDF, REPORT, ENTITY_NAME, CAPTION, [])
    await flushPromises()

    expect(vi.mocked(displayNotification))
      .toHaveBeenCalledWith('error', 'keyMoments.export.error.pdf')
  })
})
