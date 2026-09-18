import { flushPromises } from '@vue/test-utils'
import { logger } from '@pulse/toolbox'
import { withSetup } from '@pulse/toolbox/utils/test'
import { displayNotification } from '@pulse/styleguide'
import { useKeyMoments } from './key-moments.composable'
import { ReportManager } from '../../managers/report.manager'
import { KeyMomentsService } from '../../services/key-moments.service'
import {
  CurrencyDisplay,
  MeasureNature,
  Renderer,
  ValueKind,
  IndicatorSign,
} from '../../enums/key-moments.enums'
import type {
  ClosingSummary,
  Dataset,
  EditorPreferences,
  ExerciceDraft,
  ExerciceSummary,
  PublishedPreferences,
  Report,
  Template,
  TemplateSummary,
} from '../../types/key-moments.types'

const data: Dataset = {
  metadata: {
    schemaVersion: '5.0.0',
    generatedAt: '2026-01-15T10:00:00Z',
    generator: 'test',
    entity: { name: 'SAS TEST', legalForm: 'SAS', siret: '12345678900015' },
    currency: 'EUR',
    locale: 'fr-FR',
    exercice: { startDate: '2025-01-01', endDate: '2025-12-31' },
    measures: [
      { key: 'N', nature: MeasureNature.PERIOD, closingDate: '2025-12-31' },
      { key: 'N-1', nature: MeasureNature.PERIOD, closingDate: '2024-12-31' },
      { key: 'variation.N-1', nature: MeasureNature.VARIATION, from: 'N-1', to: 'N' },
    ],
  },
  indicators: [
    {
      id: 'chiffre-d-affaires',
      label: "Chiffre d'affaires",
      kind: ValueKind.AMOUNT,
      sign: IndicatorSign.INCOME,
    },
  ],
  values: {},
  comments: {},
}

const template: Template = {
  version: '6.0.0',
  id: 'engagement',
  label: "Comptabilité d'engagement",
  defaultMeasures: [{ measure: 'N' }],
  screens: [],
}

const TRESORERIE: Template =
  { ...template, id: 'tresorerie', label: 'Comptabilité de trésorerie' }

const TEMPLATE_CATALOGUE: TemplateSummary[] = [
  { templateId: 1, id: 'engagement', version: '1.0.0', label: "Comptabilité d'engagement" },
  { templateId: 2, id: 'tresorerie', version: '1.0.0', label: 'Comptabilité de trésorerie' },
]

/** The default model served in two versions, the most recent one listed last. */
const VERSIONED_CATALOGUE: TemplateSummary[] = [
  ...TEMPLATE_CATALOGUE,
  { templateId: 3, id: 'engagement', version: '1.1.0', label: "Comptabilité d'engagement" },
]

/** Two exercices, the most recent one carrying two imports of its figures. */
const EXERCICES: ExerciceSummary[] = [
  {
    exerciceId: 9,
    exerciceStartDate: '2025-01-01',
    exerciceEndDate: '2025-12-31',
    closingId: 90,
    version: 2,
    generatedAt: '2026-01-15T10:00:00Z',
  },
  {
    exerciceId: 8,
    exerciceStartDate: '2024-01-01',
    exerciceEndDate: '2024-12-31',
    closingId: 80,
    version: 1,
    generatedAt: '2025-01-15T10:00:00Z',
  },
]

const CLOSINGS: Record<number, ClosingSummary[]> = {
  9: [
    {
      closingId: 90,
      version: 2,
      generatedAt: '2026-01-15T10:00:00Z',
      importedAt: '2026-01-16T10:00:00Z',
      importedBy: 'someone',
    },
    {
      closingId: 89,
      version: 1,
      generatedAt: '2026-01-10T10:00:00Z',
      importedAt: '2026-01-11T10:00:00Z',
      importedBy: 'someone',
    },
  ],
  8: [
    {
      closingId: 80,
      version: 1,
      generatedAt: '2025-01-15T10:00:00Z',
      importedAt: '2025-01-16T10:00:00Z',
      importedBy: 'someone',
    },
  ],
}

const report: Report = {
  entity: { name: 'SAS TEST', legalForm: 'SAS', siret: '12345678900015' },
  screens: [{
    id: 'activite',
    title: 'Votre activité',
    isHidden: false,
    widgets: [{
      id: 'synthese',
      title: 'Synthèse',
      comment: 'Commentaire initial',
      span: 12,
      renderer: Renderer.TABLE,
      availableRenderers: [Renderer.TABLE, Renderer.CARDS],
      table: { columns: [], rows: [] },
      cards: [],
      isHidden: false,
      isCommentHidden: false,
    }],
  }],
}

/** The figures of the exercice before, told apart by the entity they name. */
const PREVIOUS_EXERCICE: Dataset = {
  ...data,
  metadata: {
    ...data.metadata,
    entity: { name: 'SARL DEMO', legalForm: 'SARL', siret: '98765432100023' },
  },
}

/** A closing offering two readings, which is what the selector needs to appear. */
const COMPARABLE: Dataset = {
  ...data,
  metadata: {
    ...data.metadata,
    measures: [
      ...data.metadata.measures,
      { key: 'N-2', nature: MeasureNature.PERIOD, closingDate: '2023-12-31' },
      { key: 'variation.N-2', nature: MeasureNature.VARIATION, from: 'N-2', to: 'N' },
    ],
  },
}

/** Nothing chosen yet: every preference null, exactly as the microservice says it. */
const NO_PREFERENCES: EditorPreferences = {
  templateId: null,
  preferenceComparisonExercice: null,
  preferenceCurrencyDisplay: null,
}

/** The draft of an exercice, empty of everything but what the test states. */
function buildDraft(overrides: Partial<ExerciceDraft> = {}): ExerciceDraft {
  return {
    preferences: NO_PREFERENCES,
    hiddenWidgetIds: [],
    offers: [],
    closings: [],
    ...overrides,
  }
}

/** Serves every exercice its imports, and a draft holding nothing else. */
function mockDraft(overrides: Partial<ExerciceDraft> = {}) {
  vi.spyOn(KeyMomentsService, 'getDraft')
    .mockImplementation(async (_entityId, exerciceId) =>
      buildDraft({ closings: CLOSINGS[exerciceId] ?? [], ...overrides }))
}

function mockSources() {
  vi.spyOn(KeyMomentsService, 'getTemplateCatalogue').mockResolvedValue(TEMPLATE_CATALOGUE)
  vi.spyOn(KeyMomentsService, 'getTemplate').mockImplementation(async templateId =>
    structuredClone(templateId === 2 ? TRESORERIE : template))
  vi.spyOn(KeyMomentsService, 'getExercices').mockResolvedValue(EXERCICES)
  mockDraft()
  vi.spyOn(KeyMomentsService, 'getKeyMomentsData')
    .mockImplementation(async (_entityId, closingId) =>
      closingId === 80 ? PREVIOUS_EXERCICE : data)
  vi.spyOn(KeyMomentsService, 'importClosing').mockResolvedValue()
  vi.spyOn(KeyMomentsService, 'saveHiddenWidgets').mockResolvedValue()
  vi.spyOn(KeyMomentsService, 'savePreferences').mockResolvedValue()
  vi.spyOn(ReportManager, 'buildReport').mockReturnValue(structuredClone(report))
}

/** A closing offering two readings, so a pinned or saved one can be honoured. */
function mockComparableSources() {
  mockSources()
  vi.spyOn(KeyMomentsService, 'getKeyMomentsData').mockResolvedValue(COMPARABLE)
}

/** A closing document as the reader picks it, of the exercice it declares. */
function closingFile(endDate: string): File {
  return new File(
    [JSON.stringify({ metadata: { exercice: { startDate: '2024-01-01', endDate } } })],
    'key-moments.12345678900015.json',
    { type: 'application/json' },
  )
}

describe('useKeyMoments', () => {
  it('should open the most recent exercice on its last import', async () => {
    mockSources()

    const [{ isLoading, entity, screens, selectedExerciceId, selectedClosingId }] =
      withSetup(() => useKeyMoments(42))
    await flushPromises()

    expect(vi.mocked(KeyMomentsService.getDraft)).toHaveBeenCalledWith(42, 9)
    expect(vi.mocked(KeyMomentsService.getKeyMomentsData)).toHaveBeenCalledWith(42, 90)
    expect(selectedExerciceId.value).toBe(9)
    expect(selectedClosingId.value).toBe(90)
    expect(isLoading.value).toBe(false)
    expect(entity.value).toEqual(report.entity)
    expect(screens.value).toHaveLength(1)
  })

  /** What the draft preview lays out again, under the rule of the client page. */
  describe('snapshotSources', () => {
    it('should hand nothing before anything is loaded', () => {
      mockSources()

      const [{ snapshotSources }] = withSetup(() => useKeyMoments(42))

      expect(snapshotSources()).toBeUndefined()
    })

    it('should hand the figures and the template once the report is laid out', async () => {
      mockSources()

      const [{ snapshotSources }] = withSetup(() => useKeyMoments(42))
      await flushPromises()

      expect(snapshotSources()).toEqual({ dataset: data, template })
    })
  })

  it('should keep the template applied and the exercises it may cite', async () => {
    mockSources()

    const [{ periods, template: loaded }] = withSetup(() => useKeyMoments(42))
    await flushPromises()

    expect(periods.value.map(period => period.key)).toEqual(['N', 'N-1'])
    expect(loaded.value).toEqual(template)
  })

  it('should flag an error when the figures cannot be loaded', async () => {
    mockSources()
    vi.spyOn(KeyMomentsService, 'getKeyMomentsData').mockRejectedValue(new Error('boom'))

    const [{ isLoading, hasError, screens }] = withSetup(() => useKeyMoments(42))
    await flushPromises()

    expect(isLoading.value).toBe(false)
    expect(hasError.value).toBe(true)
    expect(screens.value).toEqual([])
    expect(vi.mocked(logger.error)).toHaveBeenCalled()
  })

  it('should not call the service when the entity id is missing', async () => {
    mockSources()

    const [{ isLoading, hasError }] = withSetup(() => useKeyMoments(null))
    await flushPromises()

    expect(vi.mocked(KeyMomentsService.getExercices)).not.toHaveBeenCalled()
    expect(isLoading.value).toBe(false)
    expect(hasError.value).toBe(true)
  })

  it('should report an empty dossier rather than an error when no exercice exists', async () => {
    mockSources()
    vi.spyOn(KeyMomentsService, 'getExercices').mockResolvedValue([])

    const [{ isLoading, hasError, hasNoClosing }] = withSetup(() => useKeyMoments(42))
    await flushPromises()

    expect(isLoading.value).toBe(false)
    expect(hasError.value).toBe(false)
    expect(hasNoClosing.value).toBe(true)
    expect(vi.mocked(KeyMomentsService.getKeyMomentsData)).not.toHaveBeenCalled()
  })

  it('should report an empty dossier when the exercice carries no import', async () => {
    mockSources()
    vi.spyOn(KeyMomentsService, 'getDraft').mockResolvedValue(buildDraft())

    const [{ hasError, hasNoClosing }] = withSetup(() => useKeyMoments(42))
    await flushPromises()

    expect(hasError.value).toBe(false)
    expect(hasNoClosing.value).toBe(true)
    expect(vi.mocked(KeyMomentsService.getKeyMomentsData)).not.toHaveBeenCalled()
  })

  // the caption and the filter bar are read outside the empty state, so what
  // the previous exercice described must not be left standing under it
  it('should drop the loaded report when the exercice opened carries no import', async () => {
    mockSources()

    const [{ entity, screens, comparisons, selectedReferenceKey, selectedClosingId, hasNoClosing, selectExercice }] =
      withSetup(() => useKeyMoments(42))
    await flushPromises()

    expect(entity.value).toEqual(report.entity)

    vi.spyOn(KeyMomentsService, 'getDraft').mockResolvedValue(buildDraft())
    await selectExercice(8)

    expect(hasNoClosing.value).toBe(true)
    expect(entity.value).toBeUndefined()
    expect(screens.value).toEqual([])
    expect(comparisons.value).toEqual([])
    expect(selectedReferenceKey.value).toBeUndefined()
    expect(selectedClosingId.value).toBeUndefined()
  })

  it('should lay the report out again without reading the sources again', async () => {
    mockSources()

    const [{ toggleWidgetVisibility }] = withSetup(() => useKeyMoments(42))
    await flushPromises()

    await toggleWidgetVisibility('synthese')

    expect(vi.mocked(KeyMomentsService.getKeyMomentsData)).toHaveBeenCalledOnce()
    expect(vi.mocked(ReportManager.buildReport))
      .toHaveBeenLastCalledWith(data, template, {
        keepHidden: true,
        inThousands: false,
        referenceKey: 'N-1',
      })
  })

  it('should reload only the template when switching, never the figures', async () => {
    mockSources()

    const [{ selectTemplate, selectedTemplateId }] = withSetup(() => useKeyMoments(42))
    await flushPromises()
    vi.mocked(KeyMomentsService.getKeyMomentsData).mockClear()

    await selectTemplate(2)

    expect(selectedTemplateId.value).toBe(2)
    expect(vi.mocked(KeyMomentsService.getTemplate)).toHaveBeenLastCalledWith(2, '1.0.0')
    expect(vi.mocked(KeyMomentsService.getKeyMomentsData)).not.toHaveBeenCalled()
    expect(vi.mocked(ReportManager.buildReport))
      .toHaveBeenLastCalledWith(data, TRESORERIE, {
        keepHidden: true,
        inThousands: false,
        referenceKey: 'N-1',
      })
  })

  it('should keep the previous template when the new one cannot be loaded', async () => {
    mockSources()

    const [{ selectTemplate, selectedTemplateId }] = withSetup(() => useKeyMoments(42))
    await flushPromises()
    vi.mocked(KeyMomentsService.getTemplate).mockRejectedValueOnce(new Error('boom'))

    await selectTemplate(2)

    expect(selectedTemplateId.value).toBe(1)
    expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', 'keyMoments.filters.templateError')
    expect(vi.mocked(logger.error)).toHaveBeenCalled()
  })

  /** Comparing two exercices is only meaningful through the same layout. */
  it('should read the figures again when switching exercice, keeping the template', async () => {
    mockSources()

    const [{ selectExercice, selectTemplate, selectedExerciceId, selectedTemplateId }] =
      withSetup(() => useKeyMoments(42))
    await flushPromises()
    await selectTemplate(2)

    await selectExercice(8)

    expect(selectedExerciceId.value).toBe(8)
    expect(selectedTemplateId.value).toBe(2)
    expect(vi.mocked(KeyMomentsService.getKeyMomentsData)).toHaveBeenLastCalledWith(42, 80)
    expect(vi.mocked(ReportManager.buildReport))
      .toHaveBeenLastCalledWith(PREVIOUS_EXERCICE, TRESORERIE, {
        keepHidden: true,
        inThousands: false,
        referenceKey: 'N-1',
      })
  })

  it('should read another import of the same exercice', async () => {
    mockSources()

    const [{ selectClosing, selectedClosingId }] = withSetup(() => useKeyMoments(42))
    await flushPromises()

    await selectClosing(89)

    expect(selectedClosingId.value).toBe(89)
    expect(vi.mocked(KeyMomentsService.getKeyMomentsData)).toHaveBeenLastCalledWith(42, 89)
    expect(vi.mocked(KeyMomentsService.getDraft)).toHaveBeenCalledOnce()
  })

  it('should expose the exercices and the imports of the one being read', async () => {
    mockSources()

    const [{ exerciceCatalogue, closingCatalogue }] = withSetup(() => useKeyMoments(42))
    await flushPromises()

    expect(exerciceCatalogue.value.map(summary => summary.exerciceId)).toEqual([9, 8])
    expect(closingCatalogue.value.map(summary => summary.closingId)).toEqual([90, 89])
  })

  it('should expose the catalogue and start on the default template', async () => {
    mockSources()

    const [{ templateCatalogue, selectedTemplateId }] = withSetup(() => useKeyMoments(42))
    await flushPromises()

    expect(templateCatalogue.value).toHaveLength(2)
    expect(selectedTemplateId.value).toBe(1)
  })

  it('should start on the most recent version of the default model', async () => {
    mockSources()
    vi.mocked(KeyMomentsService.getTemplateCatalogue).mockResolvedValue(VERSIONED_CATALOGUE)

    const [{ selectedTemplateId }] = withSetup(() => useKeyMoments(42))
    await flushPromises()

    expect(selectedTemplateId.value).toBe(3)
    expect(vi.mocked(KeyMomentsService.getTemplate)).toHaveBeenCalledWith(3, '1.1.0')
  })

  it('should offer the models of the catalogue, each named once', async () => {
    mockSources()
    vi.mocked(KeyMomentsService.getTemplateCatalogue).mockResolvedValue(VERSIONED_CATALOGUE)

    const [{ templateModelOptions }] = withSetup(() => useKeyMoments(42))
    await flushPromises()

    expect(templateModelOptions.value.map(option => option.pValue)).toEqual(['engagement', 'tresorerie'])
  })

  /** The version is never a choice: what was saved names a model, reopened on its latest. */
  it('should reopen a published template on the most recent version of its model', async () => {
    mockSources()
    vi.mocked(KeyMomentsService.getTemplateCatalogue).mockResolvedValue(VERSIONED_CATALOGUE)

    const [{ selectedTemplateId }] = withSetup(() => useKeyMoments(42, async () => ({
      templateId: 1,
      referenceKey: 'N-1',
      isInThousands: false,
    })))
    await flushPromises()

    expect(selectedTemplateId.value).toBe(3)
    expect(vi.mocked(KeyMomentsService.getTemplate)).toHaveBeenLastCalledWith(3, '1.1.0')
  })

  it('should open a model on its most recent version', async () => {
    mockSources()
    vi.mocked(KeyMomentsService.getTemplateCatalogue).mockResolvedValue(VERSIONED_CATALOGUE)

    const [{ selectModel, selectTemplate, selectedTemplateId }] =
      withSetup(() => useKeyMoments(42))
    await flushPromises()
    await selectTemplate(1)

    await selectModel('tresorerie')

    expect(selectedTemplateId.value).toBe(2)
    expect(vi.mocked(KeyMomentsService.getTemplate)).toHaveBeenLastCalledWith(2, '1.0.0')
    expect(vi.mocked(KeyMomentsService.savePreferences)).toHaveBeenLastCalledWith(42, 9, {
      templateId: 2,
      preferenceComparisonExercice: 'N-1',
      preferenceCurrencyDisplay: CurrencyDisplay.EURO,
    })
  })

  it('should keep the template laid out when a model the catalogue does not carry is asked for', async () => {
    mockSources()

    const [{ selectModel, selectedTemplateId }] = withSetup(() => useKeyMoments(42))
    await flushPromises()
    vi.mocked(KeyMomentsService.getTemplate).mockClear()

    await selectModel('gone')

    expect(selectedTemplateId.value).toBe(1)
    expect(vi.mocked(KeyMomentsService.getTemplate)).not.toHaveBeenCalled()
  })

  /**
   * The default template is a name written in the applet where the catalogue is
   * served by the microservice: the two may drift apart, and the report must
   * still be laid out under something.
   */
  it('should fall back on the head of the catalogue when the default is not served', async () => {
    mockSources()
    vi.mocked(KeyMomentsService.getTemplateCatalogue)
      .mockResolvedValue([TEMPLATE_CATALOGUE[1]!])

    const [{ selectedTemplateId, screens, hasError }] = withSetup(() => useKeyMoments(42))
    await flushPromises()

    expect(selectedTemplateId.value).toBe(2)
    expect(vi.mocked(KeyMomentsService.getTemplate)).toHaveBeenCalledWith(2, '1.0.0')
    expect(screens.value).toHaveLength(1)
    expect(hasError.value).toBe(false)
  })

  /** An empty catalogue has no head to fall back on: nothing can be laid out. */
  it('should state a failure when the catalogue carries no template at all', async () => {
    mockSources()
    vi.mocked(KeyMomentsService.getTemplateCatalogue).mockResolvedValue([])

    const [{ hasError, screens }] = withSetup(() => useKeyMoments(42))
    await flushPromises()

    expect(hasError.value).toBe(true)
    expect(screens.value).toHaveLength(0)
    expect(vi.mocked(KeyMomentsService.getTemplate)).not.toHaveBeenCalled()
  })

  it('should lay the report out again on another comparison without reloading', async () => {
    mockSources()
    vi.spyOn(KeyMomentsService, 'getKeyMomentsData').mockResolvedValue(COMPARABLE)

    const [{ comparisons, selectedReferenceKey, selectComparison }] = withSetup(() => useKeyMoments(42))
    await flushPromises()

    expect(comparisons.value.map(comparison => comparison.referenceKey)).toEqual(['N-1', 'N-2'])
    expect(selectedReferenceKey.value).toBe('N-1')

    const loadCount = vi.mocked(KeyMomentsService.getKeyMomentsData).mock.calls.length
    selectComparison('N-2')

    expect(selectedReferenceKey.value).toBe('N-2')
    expect(vi.mocked(KeyMomentsService.getKeyMomentsData).mock.calls.length).toBe(loadCount)
    expect(vi.mocked(ReportManager.buildReport)).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ referenceKey: 'N-2' }),
    )
  })

  describe('importing a closing', () => {
    it('should send the document and open the exercice it declares', async () => {
      mockSources()

      const [{ importClosing, selectedExerciceId }] = withSetup(() => useKeyMoments(42))
      await flushPromises()

      await importClosing(closingFile('2024-12-31'))

      expect(vi.mocked(KeyMomentsService.importClosing)).toHaveBeenCalledWith(
        42,
        { metadata: { exercice: { startDate: '2024-01-01', endDate: '2024-12-31' } } },
      )
      expect(selectedExerciceId.value).toBe(8)
      expect(vi.mocked(displayNotification))
        .toHaveBeenCalledWith('success', 'keyMoments.import.success')
    })

    it('should open what was imported into an empty dossier', async () => {
      mockSources()
      vi.spyOn(KeyMomentsService, 'getExercices')
        .mockResolvedValueOnce([])
        .mockResolvedValue(EXERCICES)

      const [{ importClosing, hasNoClosing }] = withSetup(() => useKeyMoments(42))
      await flushPromises()

      expect(hasNoClosing.value).toBe(true)

      await importClosing(closingFile('2025-12-31'))

      expect(hasNoClosing.value).toBe(false)
      expect(vi.mocked(KeyMomentsService.getKeyMomentsData)).toHaveBeenCalledWith(42, 90)
    })

    it('should report what the microservice refused without loading anything', async () => {
      mockSources()
      vi.spyOn(KeyMomentsService, 'importClosing').mockRejectedValue({
        response: { data: { errors: [{ code: 'schema-invalid', pointer: '', detail: 'nope' }] } },
      })

      const [{ importClosing }] = withSetup(() => useKeyMoments(42))
      await flushPromises()
      vi.mocked(KeyMomentsService.getExercices).mockClear()

      await importClosing(closingFile('2025-12-31'))

      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', 'nope')
      expect(vi.mocked(KeyMomentsService.getExercices)).not.toHaveBeenCalled()
      expect(vi.mocked(logger.error)).toHaveBeenCalled()
    })

    /**
     * A refusal about the dossier — a SIRET nobody owns, an exercice already
     * held elsewhere — is worded for the reader: the schema report says nothing
     * they could act on, and would name a pointer that is not the problem.
     */
    it.each([
      ['account-mismatch', 'keyMoments.import.rejection.accountMismatch'],
      ['exercice-account-conflict', 'keyMoments.import.rejection.exerciceAccountConflict'],
      ['unknown-siret', 'keyMoments.import.rejection.unknownSiret'],
    ])('should word the %s refusal for the reader', async (code, message) => {
      mockSources()
      vi.spyOn(KeyMomentsService, 'importClosing').mockRejectedValue({
        response: { data: { code, errors: [{ code, pointer: '', detail: 'raw' }] } },
      })

      const [{ importClosing }] = withSetup(() => useKeyMoments(42))
      await flushPromises()

      await importClosing(closingFile('2025-12-31'))

      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', message)
    })

    /** Every other refusal still falls back on the report of the schema. */
    it('should keep reporting the schema on a refusal it does not word', async () => {
      mockSources()
      vi.spyOn(KeyMomentsService, 'importClosing').mockRejectedValue({
        response: { data: { code: 'ambiguous-siret', errors: [{ pointer: '', detail: 'nope' }] } },
      })

      const [{ importClosing }] = withSetup(() => useKeyMoments(42))
      await flushPromises()

      await importClosing(closingFile('2025-12-31'))

      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', 'nope')
    })

    it('should word an unreadable file itself', async () => {
      mockSources()

      const [{ importClosing }] = withSetup(() => useKeyMoments(42))
      await flushPromises()

      await importClosing(new File(['{ not json'], 'broken.json', { type: 'application/json' }))

      expect(vi.mocked(KeyMomentsService.importClosing)).not.toHaveBeenCalled()
      expect(vi.mocked(displayNotification))
        .toHaveBeenCalledWith('error', 'keyMoments.import.error')
    })

    /**
     * The document is in: denying it would have the reader send it again, on a
     * microservice that already holds it.
     */
    it('should stand by the import when only the reading that follows it fails', async () => {
      mockSources()
      vi.spyOn(KeyMomentsService, 'getExercices')
        .mockResolvedValueOnce(EXERCICES)
        .mockRejectedValue(new Error('gateway down'))

      const [{ importClosing, hasError }] = withSetup(() => useKeyMoments(42))
      await flushPromises()

      await importClosing(closingFile('2025-12-31'))

      expect(vi.mocked(displayNotification))
        .toHaveBeenCalledWith('success', 'keyMoments.import.success')
      expect(vi.mocked(displayNotification))
        .not.toHaveBeenCalledWith('error', 'keyMoments.import.error')
      expect(hasError.value).toBe(true)
    })
  })

  describe('reportRevision', () => {

    it('should count the first reading once the figures are loaded', async () => {
      mockSources()

      const [{ reportRevision }] = withSetup(() => useKeyMoments(42))

      expect(reportRevision.value).toBe(0)

      await flushPromises()

      expect(reportRevision.value).toBe(1)
    })

    it('should count a new reading on every choice of the reader', async () => {
      mockSources()
      vi.spyOn(KeyMomentsService, 'getKeyMomentsData').mockResolvedValue(COMPARABLE)

      const [{ reportRevision, selectTemplate, selectComparison, toggleThousands }] =
        withSetup(() => useKeyMoments(42))
      await flushPromises()

      await selectTemplate(2)
      selectComparison('N-2')
      toggleThousands(true)

      expect(reportRevision.value).toBe(4)
    })

    /**
     * Leaving a sub-section out is not another reading of the report: were it
     * counted, the whole page would replay its entrance under the cursor.
     */
    it('should not count a rebuild asked for by hiding a sub-section', async () => {
      mockSources()

      const [{ reportRevision, toggleWidgetVisibility }] = withSetup(() => useKeyMoments(42))
      await flushPromises()

      await toggleWidgetVisibility('synthese')
      await toggleWidgetVisibility('synthese')

      expect(reportRevision.value).toBe(1)
    })
  })

  /**
   * What the firm publishes of the report. The decision bears on a sub-section
   * — a widget of the document — is written down at once, and read back onto
   * the template every time one is loaded, since reading a template brings the
   * document back as its author shipped it.
   */
  describe('the sub-sections left out of the publication', () => {
    /** Two sub-sections to decide on, which the flat template above has none of. */
    const SECTIONED: Template = {
      ...template,
      screens: [{
        id: 'charges',
        title: 'Vos charges',
        widgets: [
          {
            id: 'charges-externes',
            lines: [],
            display: { title: 'Évolution des charges externes', renderer: Renderer.TABLE },
          },
          {
            id: 'perso',
            lines: [],
            display: { title: 'Évolution des charges de personnel', renderer: Renderer.TABLE },
            // what the document says of the slot and of the cards, which no
            // decision on the sub-section may drop
            hidden: { comment: true, cards: ['effectif'] },
          },
        ],
      }],
    }

    /** The hiding flags of the two sub-sections, in reading order. */
    function hiddenFlags(loaded: Template | undefined) {
      return loaded?.screens[0].widgets.map(widget => widget.hidden)
    }

    function mockSectionedTemplate() {
      vi.spyOn(KeyMomentsService, 'getTemplate').mockImplementation(async () =>
        structuredClone(SECTIONED))
    }

    it('should write what the firm hid onto the template it applies', async () => {
      mockSources()
      mockSectionedTemplate()
      mockDraft({ hiddenWidgetIds: ['charges-externes'] })

      const [{ hiddenWidgetIds, template: loaded }] = withSetup(() => useKeyMoments(42))
      await flushPromises()

      expect(vi.mocked(KeyMomentsService.getDraft)).toHaveBeenCalledWith(42, 9)
      expect(hiddenWidgetIds.value).toEqual(['charges-externes'])
      expect(hiddenFlags(loaded.value)).toEqual([
        { widget: true },
        { comment: true, cards: ['effectif'] },
      ])
    })

    it('should write down the whole list when a sub-section is taken out', async () => {
      mockSources()
      mockSectionedTemplate()
      mockDraft({ hiddenWidgetIds: ['charges-externes'] })

      const [{ hiddenWidgetIds, template: loaded, toggleWidgetVisibility }] =
        withSetup(() => useKeyMoments(42))
      await flushPromises()

      await toggleWidgetVisibility('perso')

      expect(vi.mocked(KeyMomentsService.saveHiddenWidgets))
        .toHaveBeenCalledWith(42, 9, ['charges-externes', 'perso'])
      expect(hiddenWidgetIds.value).toEqual(['charges-externes', 'perso'])
      expect(hiddenFlags(loaded.value)).toEqual([
        { widget: true },
        { widget: true, comment: true, cards: ['effectif'] },
      ])
    })

    it('should put a sub-section back into the publication', async () => {
      mockSources()
      mockSectionedTemplate()
      mockDraft({ hiddenWidgetIds: ['charges-externes'] })

      const [{ hiddenWidgetIds, template: loaded, toggleWidgetVisibility }] =
        withSetup(() => useKeyMoments(42))
      await flushPromises()

      await toggleWidgetVisibility('charges-externes')

      expect(vi.mocked(KeyMomentsService.saveHiddenWidgets)).toHaveBeenCalledWith(42, 9, [])
      expect(hiddenWidgetIds.value).toEqual([])
      // the flags of the document survive, the block of the first one goes
      expect(hiddenFlags(loaded.value)).toEqual([
        undefined,
        { comment: true, cards: ['effectif'] },
      ])
    })

    /**
     * Undoing a decision states the whole list at once rather than replaying
     * the gestures that led to it, one write for one decision.
     */
    it('should write down the list a publication froze, as one decision', async () => {
      mockSources()
      mockSectionedTemplate()
      mockDraft({ hiddenWidgetIds: ['charges-externes', 'perso'] })

      const [{ hiddenWidgetIds, template: loaded, writeHiddenWidgets }] =
        withSetup(() => useKeyMoments(42))
      await flushPromises()

      await writeHiddenWidgets(['perso'])

      expect(vi.mocked(KeyMomentsService.saveHiddenWidgets)).toHaveBeenCalledWith(42, 9, ['perso'])
      expect(hiddenWidgetIds.value).toEqual(['perso'])
      expect(hiddenFlags(loaded.value)).toEqual([
        undefined,
        { widget: true, comment: true, cards: ['effectif'] },
      ])
    })

    /** A decision the base does not hold must not be displayed as taken. */
    it('should leave the page as it is when the decision cannot be written', async () => {
      mockSources()
      mockSectionedTemplate()
      vi.spyOn(KeyMomentsService, 'saveHiddenWidgets').mockRejectedValue(new Error('boom'))

      const [{ hiddenWidgetIds, template: loaded, toggleWidgetVisibility }] =
        withSetup(() => useKeyMoments(42))
      await flushPromises()

      await toggleWidgetVisibility('charges-externes')

      expect(hiddenWidgetIds.value).toEqual([])
      expect(hiddenFlags(loaded.value)?.[0]).toBeUndefined()
      expect(vi.mocked(logger.error)).toHaveBeenCalled()
      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', expect.any(String))
    })

    /**
     * Two eyes clicked in a row: the second gesture waits for the first write
     * and composes its list on what it settled, so both sub-sections end up
     * out — composing both on the list of before would put the first back.
     */
    it('should compose a second gesture on what the first one settled', async () => {
      mockSources()
      mockSectionedTemplate()

      let acceptWrite = (): void => undefined
      vi.spyOn(KeyMomentsService, 'saveHiddenWidgets').mockReturnValueOnce(
        new Promise<void>((resolve) => {
          acceptWrite = resolve
        }),
      )

      const [{ hiddenWidgetIds, toggleWidgetVisibility }] = withSetup(() => useKeyMoments(42))
      await flushPromises()

      const first = toggleWidgetVisibility('charges-externes')
      const second = toggleWidgetVisibility('perso')
      await flushPromises()

      expect(vi.mocked(KeyMomentsService.saveHiddenWidgets)).toHaveBeenCalledOnce()

      acceptWrite()
      await first
      await second

      expect(vi.mocked(KeyMomentsService.saveHiddenWidgets))
        .toHaveBeenLastCalledWith(42, 9, ['charges-externes', 'perso'])
      expect(hiddenWidgetIds.value).toEqual(['charges-externes', 'perso'])
    })

    /**
     * A draft that could not be read leaves the page on choices that are not
     * the firm's: writing them back would erase what it saved.
     */
    it('should refuse to write the choices while the draft could not be read', async () => {
      mockSources()
      vi.spyOn(KeyMomentsService, 'getDraft').mockRejectedValue(new Error('boom'))

      const [{ isInThousands, toggleThousands }] = withSetup(() => useKeyMoments(42))
      await flushPromises()

      toggleThousands(true)
      await flushPromises()

      expect(isInThousands.value).toBe(true)
      expect(vi.mocked(KeyMomentsService.savePreferences)).not.toHaveBeenCalled()
      expect(vi.mocked(displayNotification))
        .toHaveBeenCalledWith('error', 'keyMoments.draft.writeRefused')
    })

    /** Switching template reads the document afresh, decision included. */
    it('should keep the decision when the template is switched', async () => {
      mockSources()
      mockSectionedTemplate()
      mockDraft({ hiddenWidgetIds: ['charges-externes'] })

      const [{ template: loaded, selectTemplate }] = withSetup(() => useKeyMoments(42))
      await flushPromises()

      await selectTemplate(2)

      expect(hiddenFlags(loaded.value)?.[0]).toEqual({ widget: true })
    })

    /**
     * The page stays readable rather than failing: nothing decided is shown,
     * and the exercice reads as carrying no import. Said out loud all the
     * same — the empty state invites an import the firm must not replay.
     */
    it('should empty the page and say so when the draft cannot be read', async () => {
      mockSources()
      mockSectionedTemplate()
      vi.spyOn(KeyMomentsService, 'getDraft').mockRejectedValue(new Error('boom'))

      const [{ hasError, hasNoClosing, hiddenWidgetIds }] = withSetup(() => useKeyMoments(42))
      await flushPromises()

      expect(hasError.value).toBe(false)
      expect(hasNoClosing.value).toBe(true)
      expect(hiddenWidgetIds.value).toEqual([])
      expect(vi.mocked(logger.error)).toHaveBeenCalled()
      expect(vi.mocked(displayNotification))
        .toHaveBeenCalledWith('error', 'keyMoments.draft.error')
    })
  })

  /**
   * Reopening on the defaults of the page would state differences from the
   * published report that nobody made, and the button would say so.
   */
  describe('opening on what was published', () => {

    function publishedPreferences(preferences: PublishedPreferences) {
      return async () => preferences
    }

    it('should open on the gabarit, the comparison and the unit published', async () => {
      mockComparableSources()

      const [{ selectedTemplateId, selectedReferenceKey, isInThousands }] = withSetup(() =>
        useKeyMoments(42, publishedPreferences({
          templateId: 2,
          referenceKey: 'N-2',
          isInThousands: true,
        })))
      await flushPromises()

      expect(selectedTemplateId.value).toBe(2)
      expect(selectedReferenceKey.value).toBe('N-2')
      expect(isInThousands.value).toBe(true)
    })

    /** A pinned reading the closing no longer offers must not empty the page. */
    it('should fall back on the first comparison the closing offers', async () => {
      mockSources()

      const [{ selectedReferenceKey }] = withSetup(() =>
        useKeyMoments(42, publishedPreferences({
          templateId: 1,
          referenceKey: 'N-2',
          isInThousands: false,
        })))
      await flushPromises()

      expect(selectedReferenceKey.value).toBe('N-1')
    })

    /**
     * Settled before anything loads: the unit is read while the report is put
     * together, so a preference applied afterwards would show the previous one.
     */
    it('should settle the reading before the report is built', async () => {
      mockComparableSources()

      withSetup(() => useKeyMoments(42, publishedPreferences({
        templateId: 1,
        referenceKey: 'N-1',
        isInThousands: true,
      })))
      await flushPromises()

      expect(vi.mocked(ReportManager.buildReport))
        .toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.objectContaining({
          inThousands: true,
        }))
    })

    /**
     * Two exercices only compare through the same layout: an exercice with no
     * publication settles nothing and keeps the reading in progress.
     */
    it('should keep the reading in progress on an exercice never published', async () => {
      mockComparableSources()

      const [{ selectedTemplateId, selectTemplate, selectExercice }] = withSetup(() =>
        useKeyMoments(42, async () => undefined))
      await flushPromises()
      await selectTemplate(2)

      await selectExercice(8)

      expect(selectedTemplateId.value).toBe(2)
    })

    /**
     * The pinned comparison seeds the opening and nothing else: replaying it on
     * every closing would override a reading chosen in between.
     */
    it('should seed the opening only, never every closing after it', async () => {
      mockComparableSources()

      const [{ selectedReferenceKey, selectClosing }] = withSetup(() =>
        useKeyMoments(42, publishedPreferences({
          templateId: 1,
          referenceKey: 'N-2',
          isInThousands: false,
        })))
      await flushPromises()
      expect(selectedReferenceKey.value).toBe('N-2')

      await selectClosing(89)

      expect(selectedReferenceKey.value).toBe('N-1')
    })

    /**
     * Undoing a change of closing restores that one alone: the comparison in
     * use is a reading of its own, and nothing may move along with it.
     */
    it('should carry a comparison over when the caller keeps it', async () => {
      mockComparableSources()

      const [{ selectedReferenceKey, selectComparison, selectClosing }] =
        withSetup(() => useKeyMoments(42))
      await flushPromises()
      selectComparison('N-2')

      await selectClosing(89, 'N-2')

      expect(selectedReferenceKey.value).toBe('N-2')
    })
  })

  /**
   * The choices the firm saved without publishing. Each field settles on its
   * own: saved first, published second, defaults of the page last.
   */
  describe('opening on the saved preferences', () => {

    it('should open on the saved choices rather than on the published ones', async () => {
      mockComparableSources()
      mockDraft({
        preferences: {
          templateId: 2,
          preferenceComparisonExercice: 'N-2',
          preferenceCurrencyDisplay: CurrencyDisplay.THOUSANDS,
        },
      })

      const [{ selectedTemplateId, selectedReferenceKey, isInThousands }] = withSetup(() =>
        useKeyMoments(42, async () => ({
          templateId: 1,
          referenceKey: 'N-1',
          isInThousands: false,
        })))
      await flushPromises()

      expect(selectedTemplateId.value).toBe(2)
      expect(selectedReferenceKey.value).toBe('N-2')
      expect(isInThousands.value).toBe(true)
    })

    /** A field never chosen keeps what the publication settled. */
    it('should let a null field fall back on the publication', async () => {
      mockComparableSources()
      mockDraft({
        preferences: { ...NO_PREFERENCES, preferenceCurrencyDisplay: CurrencyDisplay.THOUSANDS },
      })

      const [{ selectedTemplateId, selectedReferenceKey, isInThousands }] = withSetup(() =>
        useKeyMoments(42, async () => ({
          templateId: 2,
          referenceKey: 'N-2',
          isInThousands: false,
        })))
      await flushPromises()

      expect(selectedTemplateId.value).toBe(2)
      expect(selectedReferenceKey.value).toBe('N-2')
      expect(isInThousands.value).toBe(true)
    })

    /** Nothing saved and nothing published leaves the defaults of the page. */
    it('should let a null field fall back on the defaults', async () => {
      mockComparableSources()

      const [{ selectedTemplateId, selectedReferenceKey, isInThousands }] =
        withSetup(() => useKeyMoments(42, async () => undefined))
      await flushPromises()

      expect(selectedTemplateId.value).toBe(1)
      expect(selectedReferenceKey.value).toBe('N-1')
      expect(isInThousands.value).toBe(false)
    })

    /** A gabarit the catalogue does not carry is a stale choice, never a failure. */
    it('should ignore a saved gabarit the catalogue does not carry', async () => {
      mockComparableSources()
      mockDraft({ preferences: { ...NO_PREFERENCES, templateId: 999 } })

      const [{ selectedTemplateId, hasError }] = withSetup(() => useKeyMoments(42))
      await flushPromises()

      expect(selectedTemplateId.value).toBe(1)
      expect(hasError.value).toBe(false)
    })

    /** A saved comparison the closing no longer offers must not empty the page. */
    it('should fall back on the first comparison the closing offers', async () => {
      mockSources()
      mockDraft({ preferences: { ...NO_PREFERENCES, preferenceComparisonExercice: 'N-2' } })

      const [{ selectedReferenceKey }] = withSetup(() => useKeyMoments(42))
      await flushPromises()

      expect(selectedReferenceKey.value).toBe('N-1')
    })
  })

  /**
   * Every gesture writes the three choices at once — the object replaces the
   * stored one entire — and only the gestures of the user write: opening an
   * exercice would write back what it just read.
   */
  describe('writing the preferences', () => {

    it('should not write anything while an exercice opens', async () => {
      mockSources()

      withSetup(() => useKeyMoments(42))
      await flushPromises()

      expect(vi.mocked(KeyMomentsService.savePreferences)).not.toHaveBeenCalled()
    })

    it('should write the three choices when the gabarit is chosen', async () => {
      mockSources()

      const [{ selectTemplate }] = withSetup(() => useKeyMoments(42))
      await flushPromises()

      await selectTemplate(2)

      expect(vi.mocked(KeyMomentsService.savePreferences)).toHaveBeenCalledWith(42, 9, {
        templateId: 2,
        preferenceComparisonExercice: 'N-1',
        preferenceCurrencyDisplay: CurrencyDisplay.EURO,
      })
    })

    it('should write the three choices when the comparison is chosen', async () => {
      mockComparableSources()

      const [{ selectComparison }] = withSetup(() => useKeyMoments(42))
      await flushPromises()

      selectComparison('N-2')
      await flushPromises()

      expect(vi.mocked(KeyMomentsService.savePreferences)).toHaveBeenCalledWith(42, 9, {
        templateId: 1,
        preferenceComparisonExercice: 'N-2',
        preferenceCurrencyDisplay: CurrencyDisplay.EURO,
      })
    })

    it('should write the three choices when the unit is switched', async () => {
      mockSources()

      const [{ toggleThousands }] = withSetup(() => useKeyMoments(42))
      await flushPromises()

      toggleThousands(true)
      await flushPromises()

      expect(vi.mocked(KeyMomentsService.savePreferences)).toHaveBeenCalledWith(42, 9, {
        templateId: 1,
        preferenceComparisonExercice: 'N-1',
        preferenceCurrencyDisplay: CurrencyDisplay.THOUSANDS,
      })
    })

    /** The choice is a way of reading the page: a failed save never undoes it. */
    it('should keep the choice applied and say so when the save fails', async () => {
      mockSources()
      vi.spyOn(KeyMomentsService, 'savePreferences').mockRejectedValue(new Error('boom'))

      const [{ isInThousands, toggleThousands }] = withSetup(() => useKeyMoments(42))
      await flushPromises()

      toggleThousands(true)
      await flushPromises()

      expect(isInThousands.value).toBe(true)
      expect(vi.mocked(logger.error)).toHaveBeenCalled()
      expect(vi.mocked(displayNotification))
        .toHaveBeenCalledWith('error', 'keyMoments.preferences.error')
    })
  })

  describe('the wording of the selectors', () => {
    it('should offer each catalogue the way its selector reads it', async () => {
      mockSources()

      const [{
        templateModelOptions,
        exerciceOptions,
        closingOptions,
        selectedExerciceYear,
      }] =
        withSetup(() => useKeyMoments(42))
      await flushPromises()

      expect(templateModelOptions.value[0]).toEqual({
        pValue: 'engagement',
        pLabel: "Comptabilité d'engagement",
      })
      expect(exerciceOptions.value[0]).toEqual({
        pValue: 9,
        pLabel: 'keyMoments.exerciceSelect.option',
      })
      expect(closingOptions.value[0]).toEqual({
        pValue: 90,
        pLabel: 'keyMoments.closingSelect.option',
      })
      expect(selectedExerciceYear.value).toBe('2025')
    })
  })
})
