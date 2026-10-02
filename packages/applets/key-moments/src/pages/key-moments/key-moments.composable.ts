import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { displayNotification } from '@pulse/styleguide'
import type { PDropdownOption } from '@pulse/styleguide/types'
import { DEFAULT_TEMPLATE_CODE } from '../../const/key-moments.consts'
import { checkTemplateAgainstData } from '../../utils/data.utils'
import { latestTemplateOf, resolveTemplateModels } from '../../utils/template.utils'
import {
  formatCalendarMonthYear,
  formatInstant,
} from '../../utils/date.utils'
import { buildExerciceOptions } from '../../utils/format.utils'
import { apiErrorKey } from '../../utils/api-error.utils'
import { useEntityName } from '../../composables/use-entity-name.composable'
import { ReportManager } from '../../managers/report.manager'
import { KeyMomentsService } from '../../services/key-moments.service'
import { CurrencyDisplay, RejectionCode } from '../../enums/key-moments.enums'
import type { ExerciceRecommendationsPayload } from '../../services/recommendations.service.types'
import type {
  Closing,
  ClosingSummary,
  Comparison,
  Dataset,
  ClosingEntity,
  EditorPreferences,
  ExerciceDraft,
  ExerciceSummary,
  FilterOption,
  Measure,
  PublishedPreferences,
  Screen,
  Template,
  TemplateSummary,
  WidgetHidden,
} from '../../types/key-moments.types'

/**
 * Reads two company names as a reader would: the same name written in another
 * case, with or without its accents, or with doubled spaces, is the same name.
 */
function isSameCompanyName(left: string, right: string): boolean {
  const normalize = (name: string) => name
    // Decomposed first, so that an accented letter becomes its letter plus a mark to drop
    .normalize('NFD')
    .replaceAll(/\p{M}/gu, '')
    .trim()
    .replaceAll(/\s+/g, ' ')
    .toLocaleUpperCase()

  return normalize(left) === normalize(right)
}

/** `ambiguous-siret` is deliberately absent: this route already settles the account, so no import can trigger it. */
const IMPORT_REJECTION_KEYS: Record<string, string> = {
  [RejectionCode.ACCOUNT_MISMATCH]: 'keyMoments.import.rejection.accountMismatch',
  [RejectionCode.EXERCICE_ACCOUNT_CONFLICT]: 'keyMoments.import.rejection.exerciceAccountConflict',
  [RejectionCode.UNKNOWN_SIRET]: 'keyMoments.import.rejection.unknownSiret',
}

/**
 * `readPublishedPreferences` reopens an exercice on the firm's published
 * reading instead of the page defaults. Awaited before anything loads, since
 * the report is built from the choices it settles.
 */
export function useKeyMoments(
  entityId: number | null,
  readPublishedPreferences?: (exerciceId: number) => Promise<PublishedPreferences | undefined>,
) {
  const { t } = useI18n()
  const { entityName } = useEntityName()

  const accountId = entityId

  const isLoading = ref(true)
  const isImporting = ref(false)
  const hasError = ref(false)
  const entity = ref<ClosingEntity>()
  const screens = ref<Screen[]>([])
  const template = ref<Template>()
  /** The vocabulary of the closing; values stay out */
  const measures = ref<Measure[]>([])
  const periods = computed(() => ReportManager.resolvePeriodMeasures(measures.value))

  /** Templates the reader may apply, and the one applied — saved without publishing. */
  const templateCatalogue = ref<TemplateSummary[]>([])
  const selectedTemplateId = ref<number>()
  const selectedTemplate = computed(() => templateCatalogue.value
    .find(summary => summary.templateId === selectedTemplateId.value))

  const exerciceCatalogue = ref<ExerciceSummary[]>([])
  const selectedExerciceId = ref<number>()
  const closingCatalogue = ref<ClosingSummary[]>([])
  const selectedClosingId = ref<number>()

  /**
   * The name the imported closing carries, when it is not the dossier's own.
   * Reported and nothing more: a divergence is repaired where the file is
   * produced, never patched here.
   */
  const mismatchedClosingName = computed(() => {
    const closingName = entity.value?.name
    const dossierName = entityName.value

    if (isNotNullNorEmpty(closingName) === false || dossierName === undefined) {
      return undefined
    }

    return isSameCompanyName(closingName, dossierName) ? undefined : closingName
  })

  /** Distinct from an error: a dossier with no imported closing is a normal state. */
  const hasNoClosing = ref(false)

  /** Display choices of the reader, saved like the template rather than the dossier. */
  const isInThousands = ref(false)
  const selectedReferenceKey = ref<string>()

  /**
   * Comparison the publication pinned, seeding the next closing that opens.
   * One-shot: replaying it on every switch would override a choice the reader
   * made in between.
   */
  const preferredReferenceKey = ref<string>()

  const comparisons = ref<Comparison[]>([])

  /**
   * Sub-sections kept out of the publication, by widget id, held beside the
   * template rather than in it, and per exercice — so re-importing the figures
   * never undoes the decision.
   */
  const hiddenWidgetIds = ref<string[]>([])
  /** What the draft carries of the recommendations; undefined until an exercice is read, or when its draft could not be */
  const draftRecommendations = ref<ExerciceRecommendationsPayload>()

  const isDraftUnreadable = ref(false)

  /**
   * Write in flight; the next one waits for it, so two writes in a row both
   * land. One queue for sub-sections and preferences, so the API receives them
   * in the order they were made.
   */
  let pendingWrite: Promise<void> = Promise.resolve()

  function queueWrite(write: () => Promise<void>): Promise<void> {
    const queued = pendingWrite.then(write)

    pendingWrite = queued

    return queued
  }

  /** Locale the closing was produced in, not the app's own locale. */
  const locale = ref('fr-FR')

  /**
   * Bumped on a new reading of the report — a new template, closing,
   * comparison or unit — so the page keys the report and re-enters it instead
   * of swapping in place. Never bumped by a firm decision (e.g. hiding a
   * sub-section), which would flicker the page under the cursor.
   */
  const reportRevision = ref(0)

  /** Cached so laying the report out again never re-reads the data: the template changes more often. */
  let data: Dataset | undefined

  /**
   * Cheap to call: `buildReport` is pure. Hidden sub-sections are always kept
   * here — they still carry the button that restores them — and dropped only
   * on the client-facing surface.
   */
  function rebuildReport() {
    if (data === undefined || template.value === undefined) {
      return
    }

    const report = ReportManager.buildReport(data, template.value, {
      keepHidden: true,
      inThousands: isInThousands.value,
      referenceKey: selectedReferenceKey.value,
    })
    entity.value = report.entity
    screens.value = report.screens
  }

  /**
   * What the report on screen is built from, for whoever has to lay it out
   * again under another rule — the draft preview, which drops what the firm
   * hid. Absent while nothing is loaded.
   */
  function snapshotSources(): { dataset: Dataset, template: Template } | undefined {
    return data === undefined || template.value === undefined
      ? undefined
      : { dataset: data, template: template.value }
  }

  function resetReport() {
    data = undefined
    entity.value = undefined
    screens.value = []
    measures.value = []
    comparisons.value = []
    selectedReferenceKey.value = undefined
    selectedClosingId.value = undefined
  }

  /**
   * No template asked for, or one the catalogue no longer carries, falls back
   * to the latest default model, then to the catalogue's first entry — the
   * selection follows the fallback so the filter bar names the template
   * actually laid out. An empty catalogue is the one real failure: nothing
   * can be laid out.
   */
  async function applyTemplate(templateId: number | undefined) {
    if (data === undefined) {
      return
    }

    const summary = templateCatalogue.value.find(candidate => candidate.templateId === templateId)
      ?? latestTemplateOf(templateCatalogue.value, DEFAULT_TEMPLATE_CODE)
      ?? templateCatalogue.value[0]

    if (summary === undefined) {
      hasError.value = true
      logger.error('[KeyMoments] no template in the catalogue, nothing can be laid out', templateId)

      return
    }

    if (summary.templateId !== templateId) {
      if (templateId !== undefined) {
        logger.warn('[KeyMoments] unknown template asked for, falling back on the default model', templateId)
      }

      selectedTemplateId.value = summary.templateId
    }

    // the service rebuilds the document as it validates it, so the decision of
    // the firm below is written onto a copy of our own
    template.value = await KeyMomentsService.getTemplate(summary.templateId, summary.version)
    applyHiddenWidgets()
    checkTemplateAgainstData(template.value, data)
    rebuildReport()
  }

  /**
   * Writes the hidden sub-sections onto the loaded template's widget flags, so
   * every reader of the report (navigation, deck, publication) sees the same
   * statement. Replayed after every template read, since a freshly read
   * document carries no such flag yet.
   */
  function applyHiddenWidgets() {
    template.value?.screens
      .flatMap(screen => screen.widgets)
      .forEach((widget) => {
        const hidden: WidgetHidden = {
          ...widget.hidden,
          widget: hiddenWidgetIds.value.includes(widget.id) ? true : undefined,
        }

        widget.hidden = Object.values(hidden).every(flag => flag === undefined)
          ? undefined
          : hidden
      })
  }

  /**
   * Nothing moves locally before the API accepts it. A gesture whose exercice
   * has since changed is dropped.
   */
  function composeHiddenWidgets(compose: (current: string[]) => string[]): Promise<void> {
    const exerciceId = selectedExerciceId.value

    if (accountId === null || exerciceId === undefined) {
      return Promise.resolve()
    }

    if (isDraftUnreadable.value) {
      displayNotification('error', t('keyMoments.draft.writeRefused'))

      return Promise.resolve()
    }

    return queueWrite(async () => {
      if (selectedExerciceId.value !== exerciceId) {
        logger.warn('[KeyMoments] a visibility gesture was dropped, the exercice changed meanwhile', exerciceId)

        return
      }

      const widgetIds = compose(hiddenWidgetIds.value)

      try {
        await KeyMomentsService.saveHiddenWidgets(accountId, exerciceId, widgetIds)

        if (selectedExerciceId.value !== exerciceId) {
          return
        }

        hiddenWidgetIds.value = widgetIds
        applyHiddenWidgets()
        rebuildReport()
      } catch (error) {
        logger.error('[KeyMoments] unable to write which sub-sections are published', error)
        displayNotification('error', t('keyMoments.visibility.error'))
      }
    })
  }

  async function toggleWidgetVisibility(widgetId: string) {
    await composeHiddenWidgets(current => (current.includes(widgetId)
      ? current.filter(candidate => candidate !== widgetId)
      : [...current, widgetId]))
  }

  /**
   * A draft that cannot be read back falls back to an empty one rather than
   * failing the page: the report stays readable. Still surfaced as an error,
   * so the firm doesn't unknowingly re-send figures a network failure only hid.
   */
  async function readDraft(exerciceId: number): Promise<ExerciceDraft> {
    const emptyDraft: ExerciceDraft = {
      preferences: {
        templateId: null,
        preferenceComparisonExercice: null,
        preferenceCurrencyDisplay: null,
      },
      hiddenWidgetIds: [],
      closings: [],
      recommendations: { recommendations: [] },
    }

    if (accountId === null) {
      return emptyDraft
    }

    try {
      const draft = await KeyMomentsService.getDraft(accountId, exerciceId)

      isDraftUnreadable.value = false

      return draft
    } catch (error) {
      logger.error('[KeyMoments] unable to read the draft of the exercice', error)
      displayNotification('error', t('keyMoments.draft.error'))
      isDraftUnreadable.value = true

      return emptyDraft
    }
  }

  /**
   * Replaces the stored object entirely — a partial write would erase the
   * choices it leaves out. Fired by user gestures only, never by
   * `openExercice` or `openClosing`. A choice that fails to save still stays
   * applied on screen.
   */
  async function writePreferences() {
    const exerciceId = selectedExerciceId.value

    if (accountId === null || exerciceId === undefined) {
      return
    }

    if (isDraftUnreadable.value) {
      displayNotification('error', t('keyMoments.draft.writeRefused'))

      return
    }

    await queueWrite(async () => {
      if (selectedExerciceId.value !== exerciceId) {
        return
      }

      try {
        await KeyMomentsService.savePreferences(accountId, exerciceId, {
          templateId: selectedTemplateId.value ?? null,
          preferenceComparisonExercice: selectedReferenceKey.value ?? null,
          preferenceCurrencyDisplay: isInThousands.value
            ? CurrencyDisplay.THOUSANDS
            : CurrencyDisplay.EURO,
        })
      } catch (error) {
        logger.error('[KeyMoments] unable to save the reading preferences', error)
        displayNotification('error', t('keyMoments.preferences.error'))
      }
    })
  }

  function toggleThousands(inThousands: boolean) {
    isInThousands.value = inThousands
    rebuildReport()
    reportRevision.value += 1
    writePreferences()
  }

  function selectComparison(referenceKey: string) {
    selectedReferenceKey.value = referenceKey
    rebuildReport()
    reportRevision.value += 1
    writePreferences()
  }

  /** Switching template never reloads the figures: only the layout changes. */
  async function selectTemplate(templateId: number) {
    const previousTemplateId = selectedTemplateId.value
    selectedTemplateId.value = templateId

    try {
      await applyTemplate(templateId)
    } catch (error) {
      // Revert to the previous template so the selection still matches what's laid out
      selectedTemplateId.value = previousTemplateId
      displayNotification('error', t('keyMoments.filters.templateError'))
      logger.error('[KeyMoments] unable to load the template', error)

      return
    }

    reportRevision.value += 1
    // Saves what applyTemplate actually resolved to, in case it fell back to the default
    writePreferences()
  }

  async function selectModel(code: string) {
    const latest = latestTemplateOf(templateCatalogue.value, code)

    if (latest === undefined) {
      return
    }

    await selectTemplate(latest.templateId)
  }

  /** The template is kept: two closings only compare through the same layout. */
  async function openClosing(closingId: number) {
    if (accountId === null) {
      return
    }

    selectedClosingId.value = closingId
    data = await KeyMomentsService.getKeyMomentsData(accountId, closingId)
    measures.value = data.metadata.measures
    locale.value = data.metadata.locale
    comparisons.value = ReportManager.resolveComparisons(data.metadata)
    // Falls back to the published comparison if this closing still offers it
    selectedReferenceKey.value = comparisons.value
      .find(comparison => comparison.referenceKey === preferredReferenceKey.value)
      ?.referenceKey
      ?? comparisons.value[0]?.referenceKey
    preferredReferenceKey.value = undefined
    await applyTemplate(selectedTemplateId.value)
    reportRevision.value += 1
  }

  /** Resolves a saved template id to the latest version of its model, never the exact version. */
  function catalogueTemplateId(templateId: number | null): number | undefined {
    const summary = templateCatalogue.value.find(candidate => candidate.templateId === templateId)

    return summary === undefined ? undefined : latestTemplateOf(templateCatalogue.value, summary.id)?.templateId
  }

  /** An exercice with no publication keeps whatever reading is already in progress. */
  function applyPublishedPreferences(preferences?: PublishedPreferences) {
    if (preferences === undefined) {
      return
    }

    selectedTemplateId.value = catalogueTemplateId(preferences.templateId) ?? selectedTemplateId.value
    preferredReferenceKey.value = preferences.referenceKey
    isInThousands.value = preferences.isInThousands
  }

  /**
   * Overlays the saved draft choices on top of the published ones. Each field
   * is applied independently: a null one was never chosen and keeps whatever
   * was already settled.
   */
  function applyDraftPreferences(preferences: EditorPreferences) {
    selectedTemplateId.value = catalogueTemplateId(preferences.templateId) ?? selectedTemplateId.value

    if (preferences.preferenceComparisonExercice !== null) {
      preferredReferenceKey.value = preferences.preferenceComparisonExercice
    }

    if (preferences.preferenceCurrencyDisplay !== null) {
      isInThousands.value = preferences.preferenceCurrencyDisplay === CurrencyDisplay.THOUSANDS
    }
  }

  /**
   * Opens on the closing asked for while the exercice still carries it, else
   * on its last import. An exercice with no closing yet is a normal pre-import
   * state, not a failure.
   */
  async function openExercice(exerciceId: number, closingId?: number) {
    if (accountId === null) {
      return
    }

    // Applied before the draft, so an unpublished choice still overrides the published one
    applyPublishedPreferences(await readPublishedPreferences?.(exerciceId))

    selectedExerciceId.value = exerciceId

    const draft = await readDraft(exerciceId)

    applyDraftPreferences(draft.preferences)
    // Set before the template is applied, which writes it onto the document
    hiddenWidgetIds.value = draft.hiddenWidgetIds
    closingCatalogue.value = draft.closings
    // Handed over as it was read: an unreadable draft hands nothing, so nothing is ever written over it
    // An exercice the recommendations never reached has none, rather than nothing readable
    draftRecommendations.value = isDraftUnreadable.value ? undefined : draft.recommendations ?? { recommendations: [] }

    const [lastImport] = closingCatalogue.value
    const opened = closingCatalogue.value
      .find(summary => summary.closingId === closingId)
      ?? lastImport

    if (opened === undefined) {
      hasNoClosing.value = true
      resetReport()

      return
    }

    hasNoClosing.value = false
    await openClosing(opened.closingId)
  }

  async function selectExercice(exerciceId: number, closingId?: number) {
    isLoading.value = true
    hasError.value = false

    try {
      await openExercice(exerciceId, closingId)
    } catch (error) {
      hasError.value = true
      logger.error('[KeyMoments] unable to load the exercice', error)
    } finally {
      isLoading.value = false
    }
  }

  async function selectClosing(closingId: number) {
    isLoading.value = true
    hasError.value = false

    try {
      await openClosing(closingId)
    } catch (error) {
      hasError.value = true
      logger.error('[KeyMoments] unable to load the closing', error)
    } finally {
      isLoading.value = false
    }
  }

  async function loadReport() {
    isLoading.value = true
    hasError.value = false

    if (accountId === null) {
      isLoading.value = false
      hasError.value = true
      logger.error('[KeyMoments] no entity id in the route, cannot load the key moments report')

      return
    }

    try {
      templateCatalogue.value = await KeyMomentsService.getTemplateCatalogue()
      // settled before any closing is read: the filter bar and the caption name
      // a template even on a dossier that has nothing to lay out yet
      selectedTemplateId.value = latestTemplateOf(templateCatalogue.value, DEFAULT_TEMPLATE_CODE)?.templateId
        ?? templateCatalogue.value[0]?.templateId
      exerciceCatalogue.value = await KeyMomentsService.getExercices(accountId)

      const [mostRecent] = exerciceCatalogue.value

      if (mostRecent === undefined) {
        hasNoClosing.value = true

        return
      }

      await openExercice(mostRecent.exerciceId)
    } catch (error) {
      hasError.value = true
      logger.error('[KeyMoments] unable to load the key moments report', error)
    } finally {
      isLoading.value = false
    }
  }

  async function sendClosing(file: File): Promise<Closing | undefined> {
    if (accountId === null) {
      return undefined
    }

    try {
      const closing = JSON.parse(await file.text()) as Closing

      await KeyMomentsService.importClosing(accountId, closing)

      return closing
    } catch (error) {
      logger.error('[KeyMoments] unable to import the closing', error)

      displayNotification('error', t(apiErrorKey(error, 'keyMoments.import.error', IMPORT_REJECTION_KEYS)))

      return undefined
    }
  }

  /**
   * Opens the exercice the imported document declares, matched on its closing
   * date rather than assumed to be the most recent. If opening it then fails,
   * that failure is reported like any other read failure — never as an import
   * failure, since the document was already accepted.
   */
  async function importClosing(file: File) {
    if (accountId === null) {
      return
    }

    isImporting.value = true

    try {
      const closing = await sendClosing(file)

      if (closing === undefined) {
        return
      }

      displayNotification('success', t('keyMoments.import.success'))
      hasError.value = false

      exerciceCatalogue.value = await KeyMomentsService.getExercices(accountId)

      const imported = exerciceCatalogue.value
        .find(candidate => candidate.exerciceEndDate === closing.metadata.exercice.endDate)
        ?? exerciceCatalogue.value[0]

      if (imported !== undefined) {
        await openExercice(imported.exerciceId)
      }
    } catch (error) {
      hasError.value = true
      logger.error('[KeyMoments] unable to open the exercice just imported', error)
    } finally {
      isImporting.value = false
    }
  }

  onMounted(() => {
    loadReport()
  })

  const templateModelOptions = computed<PDropdownOption[]>(() => resolveTemplateModels(templateCatalogue.value)
    .map(model => ({ pValue: model.code, pLabel: model.label })))
  const selectedModelCode = computed(() => selectedTemplate.value?.id)

  /** Named by the year it closes on, not the full closing date. */
  const exerciceOptions = computed(
    () => buildExerciceOptions(exerciceCatalogue.value, t, locale.value),
  )

  /** Re-importing adds a version rather than replacing one. */
  const closingOptions = computed(() => closingCatalogue.value.map(summary => ({
    pValue: summary.closingId,
    pLabel: t('keyMoments.closingSelect.option', {
      version: summary.version,
      date: formatInstant(summary.importedAt, locale.value),
    }),
  })))

  const comparisonOptions = computed<FilterOption[]>(() => comparisons.value
    .map(comparison => ({
      value: comparison.referenceKey,
      label: nameExercise(comparison.referenceKey, comparison.reference.closingDate),
    })))

  /** `N (12/2025)`, the way every control of the page names an exercise. */
  function nameExercise(key: string, closingDate: string): string {
    return t('keyMoments.comparisonSelect.option', {
      exercise: key,
      date: formatCalendarMonthYear(closingDate, locale.value),
    })
  }

  return {
    isLoading,
    isImporting,
    hasError,
    hasNoClosing,
    entity,
    entityName,
    mismatchedClosingName,
    screens,
    template,
    templateCatalogue,
    selectedTemplateId,
    exerciceCatalogue,
    selectedExerciceId,
    closingCatalogue,
    selectedClosingId,
    periods,
    isInThousands,
    comparisons,
    selectedReferenceKey,
    locale,
    templateModelOptions,
    selectedModelCode,
    exerciceOptions,
    closingOptions,
    comparisonOptions,
    reportRevision,
    hiddenWidgetIds,
    draftRecommendations,
    isDraftUnreadable,
    snapshotSources,
    toggleThousands,
    toggleWidgetVisibility,
    selectComparison,
    selectTemplate,
    selectModel,
    selectExercice,
    selectClosing,
    importClosing,
  }
}
