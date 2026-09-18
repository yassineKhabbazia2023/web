import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { logger } from '@pulse/toolbox'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { displayNotification } from '@pulse/styleguide'
import { HTTP_RESPONSES } from '@pulse/common/constants'
import { i18n } from '@pulse/common/i18n'
import { DEFAULT_WIDGET_SPAN } from '../const/key-moments.consts'
import { ReportManager } from '../managers/report.manager'
import { SyntheticClosingManager } from '../managers/synthetic-closing.manager'
import { TemplateEditorManager } from '../managers/template-editor.manager'
import { IndicatorsService } from '../services/indicators.service'
import { TemplateEditorService } from '../services/template-editor.service'
import { readApiError, readApiErrorDetail } from '../utils/api-error.utils'
import { slugify } from '../utils/slug.utils'
import { emptyTemplate, validateTemplate } from '../validation/key-moments.validation'
import type { EditorPlaceholder, EditorSelection, EditorWarning } from './template-editor.store.types'
import type { RawScreen, RawWidget, WidgetLocation } from '../managers/template-editor.manager.types'
import type { RawTemplateDocument, TemplateVersionItem } from '../services/template-editor.service.types'
import type { ApiError } from '../utils/api-error.utils'
import type { TemplateWarning } from '../validation/key-moments.validation.types'
import type { Indicator } from '../types/key-moments.types'

/** Whether a field holds something to read, blanks aside. */
function hasText(value: unknown): boolean {
  return typeof value === 'string' && isNotNullNorEmpty(value.trim())
}

function hasId(raw: unknown): raw is { id: string } & Record<string, unknown> {
  return typeof raw === 'object' && raw !== null && typeof (raw as { id?: unknown }).id === 'string'
    && (raw as { id: string }).id !== ''
}

/** Named by its title when it still reads as one, by its id otherwise. */
function placeholderTitle(title: unknown, id: string): string {
  return typeof title === 'string' && title !== '' ? title : id
}

function widgetPlaceholderOf(raw: { id: string } & Record<string, unknown>): EditorPlaceholder {
  const display = raw.display as { title?: unknown, span?: unknown } | undefined

  return {
    id: raw.id,
    title: placeholderTitle(display?.title, raw.id),
    span: typeof display?.span === 'number' ? display.span : DEFAULT_WIDGET_SPAN,
  }
}

/**
 * A warning as an author reads it: its label in their language, followed by
 * what it names — the widget, the indicators it cites. The code is what the
 * label is read under; the logger keeps the technical wording.
 */
function describeWarning(code: string, details: unknown[]): string {
  const message = i18n.global.t(`keyMoments.settings.editor.warnings.${code}`)
  const said = details
    .map(detail => (Array.isArray(detail) ? detail.join(', ') : String(detail)))
    .filter(detail => detail.length > 0)

  return said.length > 0 ? `${message} — ${said.join(' · ')}` : message
}

/**
 * The editor of a template document. The raw document is the source of truth:
 * the forms write only the keys they know, everything else travels untouched
 * from the version that was read to the version that is saved. What the page
 * renders is derived from it — validated, laid out on a synthetic closing —
 * and never edited itself.
 */
export const useTemplateEditorStore = defineStore('key-moments-template-editor', () => {
  const templateId = ref<number>()
  const versions = ref<TemplateVersionItem[]>([])
  const currentVersion = ref<string>()
  const rawTemplate = ref<RawTemplateDocument>()
  /** The document as it was read, which is what `isDirty` compares against */
  const loadedSnapshot = ref<string>()
  /** Label the template was opened under, which is what a rename compares against */
  const loadedLabel = ref<string>()
  const vocabulary = ref<Indicator[]>([])
  const selection = ref<EditorSelection>()
  const isLoading = ref(false)
  const isSaving = ref(false)
  /**
   * The refusal the last write came back with, kept so that the page can point
   * at what it names. Cleared by the next edit: an author correcting the
   * document is answering it.
   */
  const serverError = ref<ApiError>()
  /**
   * Set when the microservice refused to rewrite the version on screen: a
   * publication pins it. Only a new version can carry the changes then.
   */
  const isCurrentVersionLocked = ref(false)

  const isDirty = computed(() => JSON.stringify(rawTemplate.value) !== loadedSnapshot.value)

  const isCurrentVersionVisible = computed(() => versions.value
    .some(version => version.version === currentVersion.value && version.isVisible))

  /**
   * Whether the ids of the screens and the widgets may still be rewritten. The
   * comments of the closings and the hidden widgets of the dossiers hang on
   * them, and a published version is one the dossiers have already read: from
   * there on, an id is what it was given.
   */
  const areIdsEditable = computed(() => isCurrentVersionVisible.value === false
    && isCurrentVersionLocked.value === false)

  /**
   * Validated once per edit, warnings included: the two are read from the same
   * pass, so that what the banner reports is what the page renders.
   */
  const validated = computed(() => {
    // holding no document is a state of the editor, not a document that failed
    // to read: there is nothing to validate, and nothing to reproach
    if (rawTemplate.value === undefined) {
      return { template: emptyTemplate(), warnings: [] as TemplateWarning[] }
    }

    const collected: TemplateWarning[] = []
    const template = validateTemplate(rawTemplate.value, {
      onWarning: warning => collected.push(warning),
      // a screen just added carries no widget yet: dropping it would take it
      // off the canvas its author fills, and block the save on it
      keepEmptyScreens: true,
    })

    return { template, warnings: collected }
  })

  const template = computed(() => validated.value.template)

  /**
   * The report and what building it could not read, from the same pass. The
   * build takes its warnings over rather than logging them: a console filling
   * up says nothing to an author.
   */
  const built = computed(() => {
    if (rawTemplate.value === undefined) {
      return { report: undefined, warnings: [] as EditorWarning[] }
    }

    const rendered = validated.value.template
    const collected: EditorWarning[] = []
    const dataset = SyntheticClosingManager.buildDataset(
      vocabulary.value,
      rendered,
      i18n.global.t('keyMoments.settings.editor.commentPlaceholder'),
    )

    // the edit mode sees everything, hidden elements included: an element it
    // cannot show is an element it cannot bring back
    const report = ReportManager.buildReport(dataset, rendered, {
      keepHidden: true,
      keepEmptyScreens: true,
      // only what reproaches the template: the figures are synthetic here, so
      // what the build says of them says nothing to whoever authors a layout.
      // Never blocking either — a citation the vocabulary does not carry yet is
      // caught up by creating the term, where a dropped element is lost on save
      onWarning: (warning) => {
        if (warning.subject !== 'template') {
          return
        }

        collected.push({
          severity: 'unknown',
          message: describeWarning(warning.code, warning.details),
        })
      },
    })

    return { report, warnings: collected }
  })

  const report = computed(() => built.value.report)

  /** The screens of the document as authored, whatever the validation makes of them. */
  const rawScreens = computed(() => (rawTemplate.value === undefined
    ? []
    : TemplateEditorManager.screensOf(rawTemplate.value).filter(hasId)))

  /**
   * Widgets the canvas cannot draw, by screen: unreadable ones (unknown
   * indicator, unfillable exercise) or ones validation dropped. Computed from
   * the raw document rather than the build result, so each gets a canvas
   * placeholder the author can fix or remove.
   */
  const unrenderedWidgets = computed<Record<string, EditorPlaceholder[]>>(() => {
    const rendered = new Set((report.value?.screens ?? [])
      .flatMap(screen => screen.widgets.map(widget => widget.id)))

    return Object.fromEntries(rawScreens.value.map(screen => [
      screen.id,
      (Array.isArray(screen.widgets) ? screen.widgets : [])
        .filter(hasId)
        .filter(widget => rendered.has(widget.id) === false)
        .map(widgetPlaceholderOf),
    ]))
  })

  /** The screens the validation dropped, stood in for on the canvas for the same reason. */
  const unrenderedScreens = computed<EditorPlaceholder[]>(() => {
    const rendered = new Set((report.value?.screens ?? []).map(screen => screen.id))

    return rawScreens.value
      .filter(screen => rendered.has(screen.id) === false)
      .map(screen => ({ id: screen.id, title: placeholderTitle(screen.title, screen.id) }))
  })

  /** Said once each: the same reproach on twenty widgets is one thing to fix. */
  const warnings = computed<EditorWarning[]>(() => {
    const seen = new Set<string>()

    return [
      ...validated.value.warnings.map(warning => ({
        severity: warning.severity,
        // what the validation drops is named by its kind alone: the entry it
        // could not read says nothing to whoever has to find it back
        message: describeWarning(warning.code, []),
      })),
      ...built.value.warnings,
    ].filter(warning => {
      if (seen.has(warning.message)) {
        return false
      }

      seen.add(warning.message)

      return true
    })
  })

  /** An element the rendering drops would be lost on save: that one blocks */
  const hasBlockingWarnings = computed(() => warnings.value.some(warning => warning.severity === 'dropped'))

  async function loadVocabulary(): Promise<void> {
    try {
      vocabulary.value = await IndicatorsService.getIndicators()
    } catch (error) {
      logger.error('[KeyMoments] settings: reading the vocabulary failed', error)
      displayNotification('error', i18n.global.t('keyMoments.settings.editor.vocabularyError'))
    }
  }

  /** Opens a template on the version asked, on the visible one otherwise. */
  async function load(id: number, version?: string): Promise<void> {
    isLoading.value = true
    templateId.value = id
    selection.value = undefined

    try {
      versions.value = await TemplateEditorService.getVersions(id)

      const asked = version ?? TemplateEditorManager.defaultVersion(versions.value)
      const content = await TemplateEditorService.getRawContent(id, asked)

      // named only once its document is in hand: a version on the selector the
      // editor does not hold is a version a save would write the wrong content to
      currentVersion.value = asked
      rawTemplate.value = content
      loadedSnapshot.value = JSON.stringify(content)
      loadedLabel.value = typeof content.label === 'string' ? content.label : undefined
      serverError.value = undefined
      isCurrentVersionLocked.value = false
      await loadVocabulary()
    } catch (error) {
      logger.error('[KeyMoments] settings: opening the template failed', error)
      displayNotification('error', i18n.global.t('keyMoments.settings.editor.loadError'))
    } finally {
      isLoading.value = false
    }
  }

  /** Where a widget sits, for the drawers that edit one. */
  function findWidget(widgetId: string): WidgetLocation | undefined {
    if (rawTemplate.value === undefined) {
      return undefined
    }

    return TemplateEditorManager.findWidget(rawTemplate.value, widgetId)
  }

  function findScreen(screenId: string): RawScreen | undefined {
    if (rawTemplate.value === undefined) {
      return undefined
    }

    return TemplateEditorManager.findScreen(rawTemplate.value, screenId)
  }

  /**
   * A copy of what the open drawer edits, held apart from the document until it
   * is saved. Nothing a drawer writes reaches the report — nor the dirty state,
   * nor what a version save sends — before the reader asks for it.
   *
   * One draft rather than one per drawer: a single element is edited at a time,
   * and every section of a drawer reads this same copy.
   */
  const draft = ref<Record<string, unknown>>()

  /** What a selection puts in the draft, by kind. */
  function draftOf(next: EditorSelection): Record<string, unknown> | undefined {
    if (rawTemplate.value === undefined) {
      return undefined
    }

    if (next.kind === 'widget') {
      return findWidget(next.id)?.widget
    }

    if (next.kind === 'screen') {
      return findScreen(next.id)
    }

    return {
      label: rawTemplate.value.label ?? '',
      defaultMeasures: rawTemplate.value.defaultMeasures ?? [],
    }
  }

  function select(next: EditorSelection | undefined): void {
    selection.value = next

    const source = next === undefined ? undefined : draftOf(next)

    // a deep copy: the drawer writes onto it freely, and cancelling is simply
    // never handing it back
    draft.value = source === undefined ? undefined : JSON.parse(JSON.stringify(source))
  }

  function setDraft(next: Record<string, unknown>): void {
    draft.value = next
  }

  /**
   * The id the open draft would be saved under: authored freely in the field,
   * written as a slug. Empty for the template itself, which carries no id the
   * editor writes. Once the ids are frozen, the id is what it was read as: a
   * template authored outside the app may carry one the slug would rewrite.
   */
  const draftId = computed(() => {
    const id = String(draft.value?.id ?? '')

    return areIdsEditable.value ? slugify(id) : id
  })

  /**
   * What refuses the id of the open draft, if anything. An id is what names an
   * element for whoever reads the document: none can answer to nothing, and no
   * two of them can answer to the same name.
   */
  const draftIdError = computed<string | undefined>(() => {
    const edited = selection.value

    if (edited === undefined || edited.kind === 'template' || rawTemplate.value === undefined) {
      return undefined
    }

    if (draftId.value === '') {
      return i18n.global.t('keyMoments.settings.editor.idInvalid')
    }

    // the element keeps its own id: a rename is refused against the others only
    if (TemplateEditorManager.isIdAvailable(rawTemplate.value, draftId.value, edited.id) === false) {
      return i18n.global.t('keyMoments.settings.editor.idTaken')
    }

    return undefined
  })

  /**
   * What refuses the open draft beyond its id, if anything. An element the
   * validation would drop is an element the canvas could no longer show, and
   * the drawer editing it is the last place it was ever reachable from: it is
   * refused there, where it can still be answered.
   */
  const draftError = computed<string | undefined>(() => {
    const edited = selection.value
    const next = draft.value

    if (edited === undefined || next === undefined || edited.kind === 'template') {
      return undefined
    }

    if (edited.kind === 'screen') {
      return hasText(next.title) ? undefined : i18n.global.t('keyMoments.settings.editor.titleRequired')
    }

    if (hasText((next.display as { title?: unknown } | undefined)?.title) === false) {
      return i18n.global.t('keyMoments.settings.editor.titleRequired')
    }

    const lines = Array.isArray(next.lines) ? next.lines as { indicator?: unknown }[] : []

    return lines.some(line => hasText(line.indicator))
      ? undefined
      : i18n.global.t('keyMoments.settings.editor.linesRequired')
  })

  /** Hands the draft back to the document, and closes what was editing it. */
  function commitDraft(): void {
    const edited = selection.value
    const next = draft.value

    if (edited === undefined || next === undefined || rawTemplate.value === undefined) {
      return
    }

    // said on the drawer: nothing is written until it is answered
    if (draftIdError.value !== undefined || draftError.value !== undefined) {
      return
    }

    if (edited.kind === 'widget') {
      const widget = { ...next, id: draftId.value } as unknown as RawWidget

      apply(edited.creation === undefined
        // the whole widget, so that a block it dropped is dropped for good
        ? TemplateEditorManager.replaceWidget(rawTemplate.value, edited.id, widget)
        // a creation enters the document here, and nowhere earlier
        : TemplateEditorManager.insertWidget(
          rawTemplate.value,
          edited.creation.screenId,
          edited.creation.index,
          widget,
        ))
    } else if (edited.kind === 'screen') {
      apply(edited.creation === undefined
        // only what the drawer edits: the sub-sections may have moved meanwhile
        ? TemplateEditorManager.updateScreen(rawTemplate.value, edited.id, {
          id: draftId.value,
          title: next.title,
          subtitle: next.subtitle,
        })
        : TemplateEditorManager.insertScreen(
          rawTemplate.value,
          { ...next, id: draftId.value } as unknown as RawScreen,
        ))
    } else {
      // no default measure is the key leaving the document, never an empty
      // list: an empty `defaultMeasures` is what the API refuses
      const measures = next.defaultMeasures as unknown[] | undefined

      apply(TemplateEditorManager.updateTemplate(rawTemplate.value, {
        label: next.label,
        defaultMeasures: measures === undefined || measures.length === 0 ? undefined : measures,
      }))
    }

    select(undefined)
  }

  /** Closes without handing anything back: the draft is simply dropped. */
  function cancelDraft(): void {
    select(undefined)
  }

  function apply(next: RawTemplateDocument): void {
    rawTemplate.value = next
    // an edit is the answer to what the last write refused
    serverError.value = undefined
  }

  function moveScreen(screenId: string, toIndex: number): void {
    if (rawTemplate.value === undefined) {
      return
    }

    apply(TemplateEditorManager.moveScreen(rawTemplate.value, screenId, toIndex))
  }

  function moveWidget(widgetId: string, toScreenId: string, toIndex: number): void {
    if (rawTemplate.value === undefined) {
      return
    }

    apply(TemplateEditorManager.moveWidget(rawTemplate.value, widgetId, toScreenId, toIndex))
  }

  /**
   * Opens a drawer on a screen the document does not carry yet. Nothing is
   * written before the drawer is saved: cancelling leaves the document as it
   * was, where an element added on the spot would have to be removed by hand.
   *
   * Returns the id it gave, which is what the caller selects and never rewrites.
   */
  function startScreen(title: string): string {
    if (rawTemplate.value === undefined) {
      return ''
    }

    const screen = TemplateEditorManager.newScreen(rawTemplate.value, title)

    selection.value = { kind: 'screen', id: screen.id, creation: true }
    draft.value = { ...screen }

    return screen.id
  }

  /** A widget on the same terms, holding where it lands until it is saved. */
  function startWidget(screenId: string, index: number, renderer: string, title: string): string {
    if (rawTemplate.value === undefined) {
      return ''
    }

    const widget = TemplateEditorManager.newWidget(rawTemplate.value, renderer, title)

    selection.value = { kind: 'widget', id: widget.id, creation: { screenId, index } }
    draft.value = { ...widget }

    return widget.id
  }

  function toggleWidgetHidden(widgetId: string): void {
    if (rawTemplate.value === undefined) {
      return
    }

    apply(TemplateEditorManager.toggleWidgetHidden(rawTemplate.value, widgetId))
  }

  function removeScreen(screenId: string): void {
    if (rawTemplate.value === undefined) {
      return
    }

    apply(TemplateEditorManager.removeScreen(rawTemplate.value, screenId))
    select(undefined)
  }

  function removeWidget(widgetId: string): void {
    if (rawTemplate.value === undefined) {
      return
    }

    apply(TemplateEditorManager.removeWidget(rawTemplate.value, widgetId))
    select(undefined)
  }

  /** What every write answers with when it is refused. */
  function readRefusal(error: unknown, fallbackKey: string): void {
    logger.error('[KeyMoments] settings: writing the template failed', error)
    serverError.value = readApiError(error)
    displayNotification('error', readApiErrorDetail(error) ?? i18n.global.t(fallbackKey))
  }

  /**
   * The label lives in two places the reader sees as one: inside the document,
   * where the report reads it, and on the template, where the catalogue and
   * every other version read it. Writing one without the other would have the
   * same template answer to two names, so a rename travels with the content.
   */
  async function renameIfNeeded(id: number): Promise<void> {
    const label = rawTemplate.value?.label

    if (typeof label !== 'string' || label === loadedLabel.value) {
      return
    }

    await TemplateEditorService.updateLabel(id, label)
    loadedLabel.value = label
  }

  /**
   * Writes the version on screen in place, which is what the editor saves.
   * Refused with a `409` as soon as a publication pins it — the version is then
   * marked locked, and only a new version can carry the changes.
   */
  async function saveContent(): Promise<boolean> {
    const id = templateId.value
    const version = currentVersion.value
    const content = rawTemplate.value

    if (id === undefined || version === undefined || content === undefined) {
      return false
    }

    if (hasBlockingWarnings.value) {
      displayNotification('error', i18n.global.t('keyMoments.settings.editor.blocked'))

      return false
    }

    isSaving.value = true

    try {
      await TemplateEditorService.updateContent(id, version, content)
      await renameIfNeeded(id)
      versions.value = await TemplateEditorService.getVersions(id)
      loadedSnapshot.value = JSON.stringify(content)
      serverError.value = undefined
      isCurrentVersionLocked.value = false
      displayNotification('success', i18n.global.t('keyMoments.settings.editor.saved'))

      return true
    } catch (error) {
      isCurrentVersionLocked.value = readApiError(error)?.status === HTTP_RESPONSES.CONFLICT
      readRefusal(error, 'keyMoments.settings.editor.saveError')

      return false
    } finally {
      isSaving.value = false
    }
  }

  /**
   * Drops a version. Refused on the visible one, on one a publication pins and
   * on the last one left; the editor then reopens on whichever version remains.
   */
  async function deleteVersion(version: string): Promise<boolean> {
    const id = templateId.value

    if (id === undefined) {
      return false
    }

    isSaving.value = true

    try {
      await TemplateEditorService.deleteVersion(id, version)
      displayNotification('success', i18n.global.t('keyMoments.settings.editor.versionDeleted'))
      isSaving.value = false
      // the version on screen may be the one that just went: reopen on what is left
      await load(id, version === currentVersion.value ? undefined : currentVersion.value)

      return true
    } catch (error) {
      readRefusal(error, 'keyMoments.settings.editor.deleteVersionError')
      isSaving.value = false

      return false
    }
  }

  /**
   * Appends the document as a new version. Nothing is activated: the editor
   * stays on what it just wrote, and publishing it is another gesture.
   */
  async function saveVersion(version: string): Promise<boolean> {
    const id = templateId.value
    const content = rawTemplate.value

    if (id === undefined || content === undefined) {
      return false
    }

    if (hasBlockingWarnings.value) {
      displayNotification('error', i18n.global.t('keyMoments.settings.editor.blocked'))

      return false
    }

    isSaving.value = true

    try {
      await TemplateEditorService.addVersion(id, version, content)
      await renameIfNeeded(id)
      versions.value = await TemplateEditorService.getVersions(id)
      currentVersion.value = version
      loadedSnapshot.value = JSON.stringify(content)
      serverError.value = undefined
      // a version nobody has published yet is a version the editor may rewrite
      isCurrentVersionLocked.value = false
      displayNotification('success', i18n.global.t('keyMoments.settings.editor.versionSaved'))

      return true
    } catch (error) {
      readRefusal(error, 'keyMoments.settings.editor.saveError')

      return false
    } finally {
      isSaving.value = false
    }
  }

  /**
   * Switches which version the dossiers read. The list is rewritten here rather
   * than read back: one version is visible at a time, and that is the whole
   * change the call makes.
   */
  async function setVisible(): Promise<boolean> {
    const id = templateId.value
    const version = currentVersion.value

    if (id === undefined || version === undefined) {
      return false
    }

    isSaving.value = true

    try {
      await TemplateEditorService.setVisibleVersion(id, version)
      versions.value = versions.value.map(candidate => ({
        ...candidate,
        isVisible: candidate.version === version,
      }))
      displayNotification('success', i18n.global.t('keyMoments.settings.editor.madeVisible'))

      return true
    } catch (error) {
      readRefusal(error, 'keyMoments.settings.editor.visibleError')

      return false
    } finally {
      isSaving.value = false
    }
  }

  function reset(): void {
    templateId.value = undefined
    versions.value = []
    currentVersion.value = undefined
    rawTemplate.value = undefined
    loadedSnapshot.value = undefined
    selection.value = undefined
    draft.value = undefined
    loadedLabel.value = undefined
    serverError.value = undefined
    isCurrentVersionLocked.value = false
    isLoading.value = false
    isSaving.value = false
  }

  return {
    templateId,
    versions,
    currentVersion,
    rawTemplate,
    vocabulary,
    selection,
    draft,
    draftIdError,
    draftError,
    areIdsEditable,
    isLoading,
    isSaving,
    isDirty,
    isCurrentVersionVisible,
    isCurrentVersionLocked,
    serverError,
    template,
    warnings,
    hasBlockingWarnings,
    report,
    unrenderedWidgets,
    unrenderedScreens,
    load,
    loadVocabulary,
    select,
    setDraft,
    commitDraft,
    cancelDraft,
    findScreen,
    findWidget,
    moveScreen,
    moveWidget,
    startScreen,
    startWidget,
    toggleWidgetHidden,
    removeScreen,
    removeWidget,
    saveContent,
    saveVersion,
    setVisible,
    deleteVersion,
    reset,
  }
})
