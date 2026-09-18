import { createPinia, setActivePinia } from 'pinia'
import { flushPromises } from '@vue/test-utils'
import keyMomentsEngagement from '@key-moments/templates/key-moments.engagement.template.json'
import keyMomentsIndicators from '@key-moments/__mocks__/json/key-moments.indicators.json'
import { TemplateEditorService } from '@key-moments/services/template-editor.service'
import { IndicatorsService } from '@key-moments/services/indicators.service'
import { useTemplateEditorStore } from '@key-moments/stores/template-editor.store'
import { useWidgetDrawer } from './widget-drawer.composable'
import type { Indicator } from '@key-moments/types/key-moments.types'

const VERSIONS = [{ version: '1.0.0', publishedAt: '2026-07-01', publishedBy: 'a', isVisible: true }]
/** A version no publication has read yet, which is where the ids may still be rewritten */
const DRAFT_VERSIONS = [{ version: '1.0.0', publishedAt: '2026-07-01', publishedBy: 'a', isVisible: false }]

async function openOn(widgetId: string) {
  const store = useTemplateEditorStore()
  await store.load(1)
  store.select({ kind: 'widget', id: widgetId })

  return { store, drawer: useWidgetDrawer() }
}

/** A widget being created, on the version asked. */
async function startOn(title: string, versions = DRAFT_VERSIONS) {
  vi.mocked(TemplateEditorService.getVersions).mockResolvedValue(versions)
  const store = useTemplateEditorStore()
  await store.load(1)
  store.startWidget('activite', 0, 'table', title)

  return { store, drawer: useWidgetDrawer() }
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.spyOn(TemplateEditorService, 'getVersions').mockResolvedValue(VERSIONS)
  vi.spyOn(TemplateEditorService, 'getRawContent').mockResolvedValue(structuredClone(keyMomentsEngagement))
  vi.spyOn(IndicatorsService, 'getIndicators')
    .mockResolvedValue(keyMomentsIndicators.indicators as unknown as Indicator[])
})

describe('useWidgetDrawer', () => {

  it('should open on the selected widget and close by clearing the selection', async () => {
    const { store, drawer } = await openOn('synthese')

    expect(drawer.isOpen.value).toBe(true)
    expect(drawer.widget.value?.id).toBe('synthese')

    drawer.cancel()

    expect(drawer.isOpen.value).toBe(false)
    expect(store.selection).toBeUndefined()
  })

  it('should keep every edit out of the document until it is saved', async () => {
    const { store, drawer } = await openOn('synthese')

    drawer.setDisplay({ title: 'Autre titre' })

    // the copy carries it, the document does not
    expect(drawer.widget.value?.display.title).toBe('Autre titre')
    expect(store.findWidget('synthese')?.widget.display.title).toBe('Synthèse de l\'activité')
    expect(store.isDirty).toBe(false)

    drawer.save()

    expect(store.findWidget('synthese')?.widget.display.title).toBe('Autre titre')
    expect(store.isDirty).toBe(true)
    expect(store.selection).toBeUndefined()
  })

  it('should drop every edit when the drawer is cancelled', async () => {
    const { store, drawer } = await openOn('synthese')

    drawer.setDisplay({ title: 'Autre titre' })
    drawer.addLine()
    drawer.cancel()

    expect(store.findWidget('synthese')?.widget.display.title).toBe('Synthèse de l\'activité')
    expect(store.isDirty).toBe(false)
  })

  it('should write one display field without touching its siblings', async () => {
    const { drawer } = await openOn('synthese')

    drawer.setDisplay({ title: 'Autre titre' })

    expect(drawer.widget.value?.display).toMatchObject({ title: 'Autre titre', renderer: 'table', span: 12 })
  })

  it('should carry the id along with the title as long as it was not authored', async () => {
    const { drawer } = await startOn('Détail')

    expect(drawer.widget.value?.id).toBe('detail')

    drawer.setDisplay({ title: 'Détail des charges' })

    expect(drawer.widget.value?.id).toBe('detail-des-charges')
    expect(drawer.draftIdError.value).toBeUndefined()
  })

  it('should stop following the title once the id was authored by hand', async () => {
    const { drawer } = await startOn('Détail')

    drawer.setId('mon-detail')
    drawer.setDisplay({ title: 'Détail des charges' })

    expect(drawer.widget.value?.id).toBe('mon-detail')
  })

  it('should keep the id off the ones the document already answers to', async () => {
    const { drawer } = await startOn('TBA')

    expect(drawer.widget.value?.id).toBe('tba-2')

    drawer.setDisplay({ title: 'Synthèse' })

    expect(drawer.widget.value?.id).toBe('synthese-2')
  })

  it('should leave the id alone once the version on screen is published', async () => {
    const { drawer } = await startOn('Détail', VERSIONS)

    expect(drawer.areIdsEditable.value).toBe(false)

    drawer.setDisplay({ title: 'Détail des charges' })

    expect(drawer.widget.value?.id).toBe('detail')
  })

  it('should slugify the id when the field is left, not while it is written', async () => {
    const { drawer } = await startOn('Détail')

    drawer.setId('Mon Détail !')
    expect(drawer.widget.value?.id).toBe('Mon Détail !')

    drawer.normalizeId()
    expect(drawer.widget.value?.id).toBe('mon-detail')
  })

  it('should refuse to save an id another element already answers to', async () => {
    const { store, drawer } = await startOn('Détail')

    drawer.setId('tba')

    expect(drawer.draftIdError.value).toBe('keyMoments.settings.editor.idTaken')

    drawer.save()

    expect(store.isDirty).toBe(false)
    expect(drawer.isOpen.value).toBe(true)
  })

  it('should drop the comment slot when it is emptied', async () => {
    const { drawer } = await openOn('synthese')

    drawer.setComment('autre-slot')
    expect(drawer.widget.value?.comment).toBe('autre-slot')

    drawer.setComment('')
    expect(drawer.widget.value).not.toHaveProperty('comment')
  })

  it('should add, patch, move and remove a line', async () => {
    const { drawer } = await openOn('synthese')
    const initial = drawer.lines.value.length

    drawer.addLine()
    expect(drawer.lines.value).toHaveLength(initial + 1)
    expect(drawer.lines.value[initial]).toEqual({ indicator: '' })

    drawer.updateLine(0, { role: 'total' })
    expect(drawer.lines.value[0].role).toBe('total')

    drawer.updateLine(0, { role: undefined })
    expect(drawer.lines.value[0]).not.toHaveProperty('role')

    const first = drawer.lines.value[0].indicator
    drawer.moveLine(0, 2)
    expect(drawer.lines.value[2].indicator).toBe(first)

    drawer.removeLine(0)
    expect(drawer.lines.value).toHaveLength(initial)
  })

  it('should keep a line whose indicator is cleared, naming nothing', async () => {
    const { drawer } = await openOn('synthese')

    drawer.setLineIndicator(0, 'marge')
    expect(drawer.lines.value[0].indicator).toBe('marge')

    drawer.setLineIndicator(0, undefined)
    expect(drawer.lines.value[0].indicator).toBe('')
  })

  it('should drop the role and the reference of a line when they are cleared', async () => {
    const { drawer } = await openOn('synthese')

    drawer.setLineRole(0, 'total')
    drawer.setLineReference(0, 'marge')
    expect(drawer.lines.value[0]).toMatchObject({ role: 'total', reference: 'marge' })

    drawer.setLineRole(0, '')
    drawer.setLineReference(0, '')
    expect(drawer.lines.value[0]).not.toHaveProperty('role')
    expect(drawer.lines.value[0]).not.toHaveProperty('reference')

    drawer.setLineRole(0, 'total')
    drawer.setLineRole(0, undefined)
    expect(drawer.lines.value[0]).not.toHaveProperty('role')
  })

  it('should take the cards out of a widget and put them back', async () => {
    const { drawer } = await openOn('tba')

    drawer.toggleHiddenCard('marge')
    expect(drawer.isCardHidden('marge')).toBe(true)
    expect(drawer.widget.value?.hidden).toEqual({ cards: ['marge'] })

    drawer.toggleHiddenCard('marge')
    expect(drawer.widget.value).not.toHaveProperty('hidden')
  })

  it('should take the measures over, starting from the defaults of the template', async () => {
    const { drawer } = await openOn('tba')

    expect(drawer.usesDefaultMeasures.value).toBe(true)

    drawer.setUsesDefaultMeasures(false)

    expect(drawer.usesDefaultMeasures.value).toBe(false)
    expect(drawer.measures.value).toEqual(keyMomentsEngagement.defaultMeasures)

    drawer.setUsesDefaultMeasures(true)
    expect(drawer.widget.value).not.toHaveProperty('measures')
  })

  it('should add a named measure and a role', async () => {
    const { drawer } = await openOn('synthese')
    const initial = drawer.measures.value.length

    drawer.addMeasure('named')
    drawer.addMeasure('role')

    expect(drawer.measures.value[initial]).toEqual({ measure: 'N' })
    expect(drawer.measures.value[initial + 1]).toEqual({ role: 'variation' })

    drawer.updateMeasure(initial, { label: 'Exercice' })
    expect(drawer.measures.value[initial].label).toBe('Exercice')

    drawer.removeMeasure(initial)
    expect(drawer.measures.value).toHaveLength(initial + 1)
  })

  it('should drop the cards block when its last option is switched off', async () => {
    const { drawer } = await openOn('tba')

    expect(drawer.cards.value).toEqual({ heroFirst: true })

    drawer.setCards({ heroFirst: false })

    expect(drawer.widget.value).not.toHaveProperty('cards')
  })

  it('should keep the lines aligned on the series as long as they were derived', async () => {
    const { drawer } = await openOn('graphe-marge-ca')

    drawer.addSeries()
    drawer.updateSeries(2, { indicator: 'marge' })

    expect(drawer.lines.value).toEqual([
      { indicator: 'chiffre-d-affaires' },
      { indicator: 'taux-de-marge' },
      { indicator: 'marge' },
    ])
  })

  it('should stop following the series once the lines were authored by hand', async () => {
    const { drawer } = await openOn('graphe-marge-ca')

    drawer.updateLine(0, { role: 'total' })
    drawer.addSeries()
    drawer.updateSeries(2, { indicator: 'marge' })

    expect(drawer.lines.value).toHaveLength(2)
  })

  it('should write the block the new kind of chart reads, and nothing of the old one', async () => {
    const { drawer } = await openOn('graphe-marge-ca')

    drawer.setChartKind('composition')

    expect(drawer.chart.value).toEqual({ kind: 'composition', period: 'current', stacks: [], groups: [] })

    drawer.setChartKind('stackedBars')

    expect(drawer.chart.value).toEqual({ kind: 'stackedBars', series: [] })
  })

  it('should start the chart of a balance image as a composition', async () => {
    const { drawer } = await startOn('Bilan')

    drawer.setDisplay({ renderer: 'balanceImage' })
    drawer.setChart({ period: 'current' })

    expect(drawer.chart.value).toEqual({ kind: 'composition', period: 'current' })
  })

  it('should edit the groups of a composition', async () => {
    const { drawer } = await openOn('bilan-image-n')

    drawer.addGroup('Autre')
    expect(drawer.groups.value[3]).toEqual({ label: 'Autre', indicators: [] })

    drawer.updateGroup(3, { color: 'balanceCash', indicators: ['disponibilites'] })
    expect(drawer.groups.value[3]).toEqual({
      label: 'Autre',
      color: 'balanceCash',
      indicators: ['disponibilites'],
    })

    drawer.removeGroup(3)
    expect(drawer.groups.value).toHaveLength(3)
  })

  it('should set the axis titles without dropping the series', async () => {
    const { drawer } = await openOn('graphe-marge-ca')

    drawer.setChart({ primaryAxisTitle: 'Autre', secondaryAxisTitle: undefined })

    expect(drawer.chart.value?.primaryAxisTitle).toBe('Autre')
    expect(drawer.chart.value).not.toHaveProperty('secondaryAxisTitle')
    expect(drawer.chart.value?.series).toHaveLength(2)
  })

  it('should drop an axis title when it is emptied', async () => {
    const { drawer } = await openOn('graphe-marge-ca')

    drawer.setAxisTitle('secondaryAxisTitle', 'Taux')
    expect(drawer.chart.value?.secondaryAxisTitle).toBe('Taux')

    drawer.setAxisTitle('secondaryAxisTitle', '')
    expect(drawer.chart.value).not.toHaveProperty('secondaryAxisTitle')
  })

  it('should drop the periods when none is picked, which reads every period', async () => {
    const { drawer } = await openOn('graphe-marge-ca')

    drawer.setChartPeriods(['N', 'N-1'])
    expect(drawer.chart.value?.periods).toEqual(['N', 'N-1'])

    drawer.setChartPeriods([])
    expect(drawer.chart.value).not.toHaveProperty('periods')
  })

  it('should keep a series whose indicator is cleared, naming nothing', async () => {
    const { drawer } = await openOn('graphe-marge-ca')

    drawer.setSeriesIndicator(0, undefined)

    expect(drawer.series.value[0].indicator).toBe('')
  })

  it('should not write the bar type, which a series draws by default', async () => {
    const { drawer } = await openOn('graphe-marge-ca')

    drawer.setSeriesType(0, 'line')
    expect(drawer.series.value[0].type).toBe('line')

    drawer.setSeriesType(0, 'bar')
    expect(drawer.series.value[0]).not.toHaveProperty('type')
  })

  it('should render nothing when the selection is not a widget', async () => {
    const store = useTemplateEditorStore()
    await store.load(1)
    await flushPromises()
    store.select({ kind: 'template' })

    const drawer = useWidgetDrawer()

    expect(drawer.isOpen.value).toBe(false)
    expect(drawer.lines.value).toEqual([])
    expect(drawer.measures.value).toEqual([])
  })
})
