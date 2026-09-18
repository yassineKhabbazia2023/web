import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { isNullOrEmpty } from '@pulse/toolbox/utils/validator'
import { useMeasuresList } from '@key-moments/composables/use-measures-list.composable'
import { ChartKind, ChartSeriesType, PeriodRole, Renderer } from '@key-moments/enums/key-moments.enums'
import { TemplateEditorManager } from '@key-moments/managers/template-editor.manager'
import { useTemplateEditorStore } from '@key-moments/stores/template-editor.store'
import { movedInList, patchRecord } from '@key-moments/utils/patch.utils'
import { slugify } from '@key-moments/utils/slug.utils'
import type { RawLine, RawWidget } from '@key-moments/managers/template-editor.manager.types'
import type { RawCards, RawChart, RawGroup, RawMeasure, RawSeries } from './widget-drawer.types'

/**
 * Everything the widget drawer writes. It writes onto a copy the store holds
 * for the open drawer, never onto the document: the report, the dirty state and
 * what a version save sends only learn of an edit once it is handed back.
 *
 * Only the keys a section knows are ever written. A block emptied of all its
 * settings leaves the copy instead of staying as an empty object.
 */
export function useWidgetDrawer() {
  const store = useTemplateEditorStore()
  const { selection, rawTemplate, draft, draftIdError, draftError, areIdsEditable } = storeToRefs(store)

  /** The widget as it is being edited, which is the copy and not the document */
  const widget = computed(() => (selection.value?.kind === 'widget'
    ? draft.value as unknown as RawWidget | undefined
    : undefined))

  const isOpen = computed({
    get: () => widget.value !== undefined,
    set: (open: boolean) => {
      if (open === false) {
        cancel()
      }
    },
  })

  const renderer = computed(() => widget.value?.display.renderer ?? '')

  /** Closes without handing anything back. */
  function cancel(): void {
    store.cancelDraft()
  }

  /** Hands the copy back to the document, which is what redraws the report. */
  function save(): void {
    store.commitDraft()
  }

  function patch(next: Record<string, unknown>): void {
    if (widget.value === undefined) {
      return
    }

    store.setDraft(patchRecord({ ...widget.value } as Record<string, unknown>, next))
  }

  /* --- general --- */

  function setDisplay(next: { title?: string, renderer?: string, span?: number }): void {
    const current = widget.value

    if (current === undefined) {
      return
    }

    const display = { ...current.display, ...next }

    // the id travels with the title as long as its author has not taken it over
    if (next.title !== undefined && rawTemplate.value !== undefined && areIdsEditable.value) {
      patch({
        display,
        id: TemplateEditorManager.followingId(
          rawTemplate.value,
          current.id,
          current.display.title,
          next.title,
        ),
      })

      return
    }

    patch({ display })
  }

  /** Authored freely while the field is being written, slugified on leaving it. */
  function setId(id: string): void {
    patch({ id })
  }

  function normalizeId(): void {
    if (widget.value === undefined) {
      return
    }

    patch({ id: slugify(widget.value.id) })
  }

  /** An empty slot is no slot: the key leaves rather than holding an empty name. */
  function setComment(slot: string): void {
    patch({ comment: slot === '' ? undefined : slot })
  }

  /* --- lines --- */

  const lines = computed(() => (widget.value?.lines ?? []) as RawLine[])

  function setLines(next: RawLine[]): void {
    patch({ lines: next })
  }

  function addLine(): void {
    setLines([...lines.value, { indicator: '' }])
  }

  function removeLine(index: number): void {
    setLines(lines.value.filter((_line, position) => position !== index))
  }

  function updateLine(index: number, next: Record<string, unknown>): void {
    setLines(lines.value.map((line, position) => (
      position === index ? patchRecord({ ...line }, next) : line
    )))
  }

  function moveLine(from: number, to: number): void {
    setLines(movedInList(lines.value, from, to))
  }

  /** A cleared indicator keeps its line, which then names nothing yet. */
  function setLineIndicator(index: number, indicator: string | undefined): void {
    updateLine(index, { indicator: indicator ?? '' })
  }

  /** A cleared role or reference leaves the line rather than holding an empty value. */
  function setLineRole(index: number, role: string | undefined): void {
    updateLine(index, { role: isNullOrEmpty(role) ? undefined : role })
  }

  function setLineReference(index: number, reference: string | undefined): void {
    updateLine(index, { reference: isNullOrEmpty(reference) ? undefined : reference })
  }

  /* --- cards left out, which the cards renderer alone reads --- */

  const hiddenCards = computed(() => (widget.value?.hidden as { cards?: string[] } | undefined)?.cards ?? [])

  function isCardHidden(indicator: string): boolean {
    return hiddenCards.value.includes(indicator)
  }

  function toggleHiddenCard(indicator: string): void {
    // a line naming nothing yet has no card to leave out
    if (indicator === '') {
      return
    }

    const hidden = { ...(widget.value?.hidden as Record<string, unknown> | undefined) }
    const next = isCardHidden(indicator)
      ? hiddenCards.value.filter(candidate => candidate !== indicator)
      : [...hiddenCards.value, indicator]

    const patched = patchRecord(hidden, { cards: next.length > 0 ? next : undefined })

    // an empty block leaves the document rather than staying as `{}`
    patch({ hidden: Object.keys(patched).length > 0 ? patched : undefined })
  }

  /* --- measures --- */

  const usesDefaultMeasures = computed(() => widget.value?.measures === undefined)

  const measures = computed(() => (widget.value?.measures ?? []) as RawMeasure[])

  function setMeasures(next: RawMeasure[]): void {
    patch({ measures: next })
  }

  /**
   * Going off the defaults starts from a copy of them rather than from nothing:
   * an author who takes the columns over is adjusting them, not rebuilding them.
   */
  function setUsesDefaultMeasures(usesDefaults: boolean): void {
    if (usesDefaults) {
      patch({ measures: undefined })

      return
    }

    const defaults = (rawTemplate.value?.defaultMeasures ?? []) as RawMeasure[]

    setMeasures(JSON.parse(JSON.stringify(defaults)) as RawMeasure[])
  }

  const {
    addMeasure,
    updateMeasure,
    removeMeasure,
    moveMeasure,
  } = useMeasuresList(measures, setMeasures)

  /* --- cards --- */

  const cards = computed(() => (widget.value?.cards ?? {}) as RawCards)

  /** Every option is a flag: switched off, it leaves rather than reading false. */
  function setCards(next: Partial<Record<keyof RawCards, boolean>>): void {
    const patched = patchRecord(
      { ...cards.value } as Record<string, unknown>,
      Object.fromEntries(Object.entries(next).map(([key, value]) => [key, value === true ? true : undefined])),
    )

    patch({ cards: Object.keys(patched).length > 0 ? patched : undefined })
  }

  /* --- chart --- */

  const chart = computed(() => widget.value?.chart as RawChart | undefined)

  const series = computed(() => chart.value?.series ?? [])

  const groups = computed(() => chart.value?.groups ?? [])

  /**
   * The kind a chart block starts on when the widget carries none: the balance
   * image is a composition and reads nothing else, every other renderer draws
   * series.
   */
  const defaultChartKind = computed(() => (renderer.value === Renderer.BALANCE_IMAGE
    ? ChartKind.COMPOSITION
    : ChartKind.GROUPED_BARS))

  function setChart(next: Record<string, unknown>): void {
    patch({
      chart: patchRecord({ kind: defaultChartKind.value, ...chart.value } as Record<string, unknown>, next),
    })
  }

  function setAxisTitle(axis: 'primaryAxisTitle' | 'secondaryAxisTitle', title: string): void {
    setChart({ [axis]: title === '' ? undefined : title })
  }

  /** No period picked means every period: the key leaves rather than holding an empty list. */
  function setChartPeriods(periods: string[]): void {
    setChart({ periods: periods.length > 0 ? periods : undefined })
  }

  /**
   * Two shapes of chart, and nothing in common between them: switching kind
   * writes the block the new shape reads, rather than leaving the settings of
   * the other one behind for the validation to drop.
   */
  function setChartKind(kind: string): void {
    if (kind === chart.value?.kind) {
      return
    }

    if (kind === ChartKind.COMPOSITION) {
      patch({ chart: { kind, period: PeriodRole.CURRENT, stacks: [], groups: [] } })

      return
    }

    patch({ chart: { kind, series: [] } })
  }

  /** Whether the lines are still exactly what the series say, untouched by hand. */
  function areLinesDerivedFromSeries(): boolean {
    const derived = TemplateEditorManager.linesFromSeries(series.value)

    return JSON.stringify(lines.value) === JSON.stringify(derived)
  }

  function syncLinesFromSeries(): void {
    setLines(TemplateEditorManager.linesFromSeries(series.value))
  }

  /**
   * The lines follow the series as long as nobody has edited them by hand: a
   * chart reads what it draws, and authoring it twice is what this avoids.
   */
  function setSeries(next: RawSeries[]): void {
    const shouldFollow = areLinesDerivedFromSeries()

    setChart({ series: next })

    if (shouldFollow) {
      setLines(TemplateEditorManager.linesFromSeries(next))
    }
  }

  function addSeries(): void {
    setSeries([...series.value, { indicator: '' }])
  }

  function updateSeries(index: number, next: Record<string, unknown>): void {
    setSeries(series.value.map((entry, position) => (
      position === index ? patchRecord({ ...entry }, next) : entry
    )))
  }

  function setSeriesIndicator(index: number, indicator: string | undefined): void {
    updateSeries(index, { indicator: indicator ?? '' })
  }

  /** Bars are what a series draws by default: that type is never written. */
  function setSeriesType(index: number, type: string): void {
    updateSeries(index, { type: type === ChartSeriesType.BAR ? undefined : type })
  }

  function removeSeries(index: number): void {
    setSeries(series.value.filter((_entry, position) => position !== index))
  }

  function moveSeries(from: number, to: number): void {
    setSeries(movedInList(series.value, from, to))
  }

  function setGroups(next: RawGroup[]): void {
    setChart({ groups: next })
  }

  function addGroup(label: string): void {
    setGroups([...groups.value, { label, indicators: [] }])
  }

  function updateGroup(index: number, next: Record<string, unknown>): void {
    setGroups(groups.value.map((group, position) => (
      position === index ? patchRecord({ ...group }, next) as RawGroup : group
    )))
  }

  function removeGroup(index: number): void {
    setGroups(groups.value.filter((_group, position) => position !== index))
  }

  return {
    isOpen,
    widget,
    renderer,
    draftIdError,
    draftError,
    areIdsEditable,
    cancel,
    save,
    setDisplay,
    setId,
    normalizeId,
    setComment,
    lines,
    setLines,
    addLine,
    removeLine,
    updateLine,
    moveLine,
    setLineIndicator,
    setLineRole,
    setLineReference,
    isCardHidden,
    toggleHiddenCard,
    usesDefaultMeasures,
    setUsesDefaultMeasures,
    measures,
    addMeasure,
    updateMeasure,
    removeMeasure,
    moveMeasure,
    cards,
    setCards,
    chart,
    setChart,
    setChartKind,
    setAxisTitle,
    setChartPeriods,
    series,
    addSeries,
    updateSeries,
    setSeriesIndicator,
    setSeriesType,
    removeSeries,
    moveSeries,
    groups,
    addGroup,
    updateGroup,
    removeGroup,
    syncLinesFromSeries,
  }
}
