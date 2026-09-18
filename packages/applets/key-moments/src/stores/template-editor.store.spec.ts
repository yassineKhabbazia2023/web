import { logger } from '@pulse/toolbox'
import { createPinia, setActivePinia } from 'pinia'
import keyMomentsEngagement from '../templates/key-moments.engagement.template.json'
import keyMomentsTresorerie from '../templates/key-moments.tresorerie.template.json'
import keyMomentsIndicators from '../__mocks__/json/key-moments.indicators.json'
import { TemplateEditorService } from '../services/template-editor.service'
import { IndicatorsService } from '../services/indicators.service'
import { useTemplateEditorStore } from './template-editor.store'
import type { Indicator } from '../types/key-moments.types'

/** Edits a screen the way the page does: through its drawer. */
function retitleScreen(store: ReturnType<typeof useTemplateEditorStore>, screenId: string, title: string): void {
  store.select({ kind: 'screen', id: screenId })
  store.setDraft({ ...store.draft, title })
  store.commitDraft()
}

/** Edits the template itself the way the page does: through its properties drawer. */
function relabelTemplate(store: ReturnType<typeof useTemplateEditorStore>, label: string): void {
  store.select({ kind: 'template' })
  store.setDraft({ ...store.draft, label })
  store.commitDraft()
}

const VERSIONS = [
  { version: '1.1.0', publishedAt: '2026-08-01', publishedBy: 'a', isVisible: false },
  { version: '1.0.0', publishedAt: '2026-07-01', publishedBy: 'a', isVisible: true },
]

beforeEach(() => {
  setActivePinia(createPinia())
  vi.spyOn(TemplateEditorService, 'getVersions').mockResolvedValue(VERSIONS)
  vi.spyOn(TemplateEditorService, 'getRawContent').mockResolvedValue(structuredClone(keyMomentsEngagement))
  vi.spyOn(IndicatorsService, 'getIndicators')
    .mockResolvedValue(keyMomentsIndicators.indicators as unknown as Indicator[])
})

describe('useTemplateEditorStore', () => {

  it('should reproach nothing while it holds no template', () => {
    const store = useTemplateEditorStore()

    expect(store.report).toBeUndefined()
    expect(store.warnings).toEqual([])
    expect(store.template).toMatchObject({ id: '', label: '', screens: [] })
    expect(vi.mocked(logger.warn)).not.toHaveBeenCalled()
  })

  it('should load the visible version by default and build a report on it', async () => {
    const store = useTemplateEditorStore()

    await store.load(1)

    expect(store.currentVersion).toBe('1.0.0')
    expect(store.isCurrentVersionVisible).toBe(true)
    expect(store.isDirty).toBe(false)
    expect(store.report?.screens).toHaveLength(6)
    expect(store.warnings).toEqual([])
  })

  it('should load the version asked instead of the visible one', async () => {
    const store = useTemplateEditorStore()

    await store.load(1, '1.1.0')

    expect(vi.mocked(TemplateEditorService.getRawContent)).toHaveBeenCalledWith(1, '1.1.0')
    expect(store.isCurrentVersionVisible).toBe(false)
  })

  it('should become dirty on an edit, and clean again when the edit is undone', async () => {
    const store = useTemplateEditorStore()
    await store.load(1)

    retitleScreen(store, 'activite', 'Autre')
    expect(store.isDirty).toBe(true)

    retitleScreen(store, 'activite', 'Votre activité')
    expect(store.isDirty).toBe(false)
  })

  it('should re-render the report on every edit', async () => {
    const store = useTemplateEditorStore()
    await store.load(1)

    store.toggleWidgetHidden('tba')

    expect(store.report?.screens[0].widgets[0].isHidden).toBe(true)
  })

  it('should open a drawer on a copy of what it edits', async () => {
    const store = useTemplateEditorStore()
    await store.load(1)

    store.select({ kind: 'widget', id: 'tba' })
    expect(store.draft).toMatchObject({ id: 'tba' })

    store.select({ kind: 'screen', id: 'activite' })
    expect(store.draft).toMatchObject({ id: 'activite', title: 'Votre activité' })

    store.select({ kind: 'template' })
    expect(store.draft).toMatchObject({ label: keyMomentsEngagement.label })
  })

  it('should keep a draft out of the document until it is handed back', async () => {
    const store = useTemplateEditorStore()
    await store.load(1)
    store.select({ kind: 'screen', id: 'activite' })

    store.setDraft({ ...store.draft, title: 'Autre' })

    expect(store.isDirty).toBe(false)
    expect(store.report?.screens.find(screen => screen.id === 'activite')?.title).toBe('Votre activité')

    store.commitDraft()

    expect(store.isDirty).toBe(true)
    expect(store.report?.screens.find(screen => screen.id === 'activite')?.title).toBe('Autre')
    expect(store.selection).toBeUndefined()
    expect(store.draft).toBeUndefined()
  })

  it('should drop the default measures key rather than write it empty', async () => {
    const store = useTemplateEditorStore()
    await store.load(1)
    store.select({ kind: 'template' })

    store.setDraft({ ...store.draft, defaultMeasures: [] })
    store.commitDraft()

    expect(store.rawTemplate).not.toHaveProperty('defaultMeasures')
  })

  it('should say what the rendering could not read under its own label', async () => {
    const document = structuredClone(keyMomentsEngagement) as Record<string, unknown>;
    (document.screens as { widgets: unknown[] }[])[0].widgets.push(42)
    vi.mocked(TemplateEditorService.getRawContent).mockResolvedValue(document)
    const store = useTemplateEditorStore()

    await store.load(1)

    expect(store.warnings).toEqual([{
      severity: 'dropped',
      message: 'keyMoments.settings.editor.warnings.widgetDropped',
    }])
    expect(store.hasBlockingWarnings).toBe(true)
  })

  it('should keep a screen just saved on the canvas, without blocking the save', async () => {
    const store = useTemplateEditorStore()
    await store.load(1)

    const screenId = store.startScreen('Nouvelle section')
    store.commitDraft()

    expect(store.report?.screens.find(screen => screen.id === screenId)?.widgets).toEqual([])
    expect(store.hasBlockingWarnings).toBe(false)
  })

  it('should write nothing while the drawer of a screen being created is open', async () => {
    const store = useTemplateEditorStore()
    await store.load(1)

    const screenId = store.startScreen('Annexes')

    expect(store.selection).toEqual({ kind: 'screen', id: screenId, creation: true })
    expect(store.draft).toEqual({ id: screenId, title: 'Annexes', widgets: [] })
    expect(store.isDirty).toBe(false)
    expect(store.report?.screens.map(screen => screen.id)).not.toContain(screenId)
  })

  it('should leave the document alone when a creation is cancelled', async () => {
    const store = useTemplateEditorStore()
    await store.load(1)

    store.startScreen('Annexes')
    store.cancelDraft()

    expect(store.isDirty).toBe(false)
    expect(store.report?.screens.map(screen => screen.id)).not.toContain('annexes')
    expect(store.draft).toBeUndefined()
  })

  it('should drop a draft that is cancelled', async () => {
    const store = useTemplateEditorStore()
    await store.load(1)
    store.select({ kind: 'template' })

    store.setDraft({ ...store.draft, label: 'Autre gabarit' })
    store.cancelDraft()

    expect(store.isDirty).toBe(false)
    expect(store.template.label).toBe(keyMomentsEngagement.label)
    expect(store.draft).toBeUndefined()
  })

  it('should move a widget to another screen', async () => {
    const store = useTemplateEditorStore()
    await store.load(1)

    store.moveWidget('tba', 'activite', 1)

    const activite = store.report?.screens.find(screen => screen.id === 'activite')
    expect(activite?.widgets[1].id).toBe('tba')
  })

  it('should add a screen and a widget, each one entering the document on its own save', async () => {
    const store = useTemplateEditorStore()
    await store.load(1)

    const screenId = store.startScreen('Annexes')
    store.commitDraft()
    const widgetId = store.startWidget(screenId, 0, 'table', 'Détail')

    expect(screenId).toBe('annexes')
    expect(widgetId).toBe('detail')
    expect(store.selection).toEqual({ kind: 'widget', id: 'detail', creation: { screenId, index: 0 } })
    expect(store.findScreen(screenId)?.widgets).toEqual([])

    // a widget enters the document once it cites something
    store.setDraft({ ...store.draft, lines: [{ indicator: 'ca' }] })
    store.commitDraft()

    expect(store.findScreen(screenId)?.widgets.map(widget => widget.id)).toEqual([widgetId])
    expect(store.selection).toBeUndefined()
  })

  it('should hold the ids open only while the version on screen is not published', async () => {
    const store = useTemplateEditorStore()

    await store.load(1)
    expect(store.areIdsEditable).toBe(false)

    await store.load(1, '1.1.0')
    expect(store.areIdsEditable).toBe(true)
  })

  it('should rename a screen under a new id, widgets and all', async () => {
    const store = useTemplateEditorStore()
    await store.load(1, '1.1.0')
    store.select({ kind: 'screen', id: 'activite' })
    const widgetIds = store.findScreen('activite')?.widgets.map(widget => widget.id)

    store.setDraft({ ...store.draft, id: 'mon-activite', title: 'Mon activité' })
    store.commitDraft()

    expect(store.draftIdError).toBeUndefined()
    expect(store.findScreen('activite')).toBeUndefined()
    expect(store.findScreen('mon-activite')?.title).toBe('Mon activité')
    expect(store.findScreen('mon-activite')?.widgets.map(widget => widget.id)).toEqual(widgetIds)
  })

  it('should rename a widget under a new id, where it sits', async () => {
    const store = useTemplateEditorStore()
    await store.load(1, '1.1.0')
    const screenId = store.findWidget('tba')?.screen.id
    store.select({ kind: 'widget', id: 'tba' })

    store.setDraft({ ...store.draft, id: 'tableau-de-bord-annuel' })
    store.commitDraft()

    expect(store.findWidget('tba')).toBeUndefined()
    expect(store.findWidget('tableau-de-bord-annuel')?.screen.id).toBe(screenId)
  })

  it('should save the id as a slug, whatever the field was left holding', async () => {
    const store = useTemplateEditorStore()
    await store.load(1, '1.1.0')
    store.select({ kind: 'screen', id: 'activite' })

    store.setDraft({ ...store.draft, id: 'Mon Activité !' })
    store.commitDraft()

    expect(store.findScreen('mon-activite')).toBeDefined()
  })

  it('should refuse an emptied id, and write nothing until it is answered', async () => {
    const store = useTemplateEditorStore()
    await store.load(1, '1.1.0')
    store.select({ kind: 'screen', id: 'activite' })

    store.setDraft({ ...store.draft, id: '   ' })
    store.commitDraft()

    expect(store.draftIdError).toBe('keyMoments.settings.editor.idInvalid')
    expect(store.isDirty).toBe(false)
    expect(store.selection).toEqual({ kind: 'screen', id: 'activite' })
  })

  it('should refuse a widget citing no indicator, and write nothing until it is answered', async () => {
    const store = useTemplateEditorStore()
    await store.load(1, '1.1.0')
    const widgetId = store.startWidget('activite', 0, 'table', 'Détail')

    store.commitDraft()

    expect(store.draftError).toBe('keyMoments.settings.editor.linesRequired')
    expect(store.findWidget(widgetId)).toBeUndefined()
    expect(store.selection?.kind).toBe('widget')

    store.setDraft({ ...store.draft, lines: [{ indicator: 'ca' }] })
    store.commitDraft()

    expect(store.draftError).toBeUndefined()
    expect(store.findWidget(widgetId)).toBeDefined()
  })

  it('should refuse a screen left without a title', async () => {
    const store = useTemplateEditorStore()
    await store.load(1, '1.1.0')
    store.select({ kind: 'screen', id: 'activite' })

    store.setDraft({ ...store.draft, title: '   ' })
    store.commitDraft()

    expect(store.draftError).toBe('keyMoments.settings.editor.titleRequired')
    expect(store.isDirty).toBe(false)
  })

  it('should leave a frozen id as it was read, whatever the slug would make of it', async () => {
    const document = structuredClone(keyMomentsEngagement) as Record<string, unknown>;
    (document.screens as { widgets: { id: string }[] }[])[0].widgets[0].id = 'ca_total'
    vi.mocked(TemplateEditorService.getRawContent).mockResolvedValue(document)
    const store = useTemplateEditorStore()
    await store.load(1)
    store.select({ kind: 'widget', id: 'ca_total' })

    store.commitDraft()

    expect(store.areIdsEditable).toBe(false)
    expect(store.findWidget('ca_total')).toBeDefined()
    expect(store.findWidget('ca-total')).toBeUndefined()
  })

  it('should stand in for a widget the build cannot draw, so that it stays reachable', async () => {
    const document = structuredClone(keyMomentsEngagement) as Record<string, unknown>
    const screens = document.screens as { id: string, widgets: unknown[] }[]
    screens[0].widgets = [{ id: 'orphan', display: { title: 'Orphan', renderer: 'table' }, lines: [{ indicator: 'nobody' }] }]
    vi.mocked(TemplateEditorService.getRawContent).mockResolvedValue(document)
    const store = useTemplateEditorStore()

    await store.load(1)

    expect(store.report?.screens[0].widgets).toEqual([])
    expect(store.unrenderedWidgets[screens[0].id].map(widget => widget.id)).toEqual(['orphan'])
    expect(store.hasBlockingWarnings).toBe(false)
  })

  it('should stand in for a widget the validation drops, so that it can be fixed or removed', async () => {
    const document = structuredClone(keyMomentsEngagement) as Record<string, unknown>
    const screens = document.screens as { id: string, widgets: unknown[] }[]
    screens[0].widgets = [{ id: 'broken', display: { title: 'Broken', renderer: 42 }, lines: [] }]
    vi.mocked(TemplateEditorService.getRawContent).mockResolvedValue(document)
    const store = useTemplateEditorStore()

    await store.load(1)

    expect(store.unrenderedWidgets[screens[0].id]).toEqual([{ id: 'broken', title: 'Broken', span: 12 }])
    expect(store.hasBlockingWarnings).toBe(true)
  })

  it('should stand in for a screen the validation drops, named by its id', async () => {
    const document = structuredClone(keyMomentsEngagement) as Record<string, unknown>
    const screens = document.screens as { id: string, title?: string }[]
    delete screens[0].title
    vi.mocked(TemplateEditorService.getRawContent).mockResolvedValue(document)
    const store = useTemplateEditorStore()

    await store.load(1)

    expect(store.report?.screens.map(screen => screen.id)).not.toContain(screens[0].id)
    expect(store.unrenderedScreens).toEqual([{ id: screens[0].id, title: screens[0].id }])
    expect(store.hasBlockingWarnings).toBe(true)
  })

  it('should refuse an id another element already answers to', async () => {
    const store = useTemplateEditorStore()
    await store.load(1, '1.1.0')
    store.select({ kind: 'screen', id: 'activite' })

    store.setDraft({ ...store.draft, id: 'tba' })
    store.commitDraft()

    expect(store.draftIdError).toBe('keyMoments.settings.editor.idTaken')
    expect(store.isDirty).toBe(false)
  })

  it('should let an element keep the id it already answers to', async () => {
    const store = useTemplateEditorStore()
    await store.load(1, '1.1.0')
    store.select({ kind: 'screen', id: 'activite' })

    store.setDraft({ ...store.draft, title: 'Autre' })

    expect(store.draftIdError).toBeUndefined()
  })

  it('should write the version on screen in place, verbatim, and come back clean', async () => {
    vi.spyOn(TemplateEditorService, 'updateContent').mockResolvedValue()
    const store = useTemplateEditorStore()
    await store.load(1)
    retitleScreen(store, 'activite', 'Autre')

    const saved = await store.saveContent()

    expect(saved).toBe(true)
    expect(vi.mocked(TemplateEditorService.updateContent))
      .toHaveBeenCalledWith(1, '1.0.0', expect.objectContaining({ id: 'engagement' }))
    expect(store.currentVersion).toBe('1.0.0')
    expect(store.isDirty).toBe(false)
    expect(store.serverError).toBeUndefined()
  })

  it('should rename the template alongside the content when its label changed', async () => {
    vi.spyOn(TemplateEditorService, 'updateContent').mockResolvedValue()
    vi.spyOn(TemplateEditorService, 'updateLabel').mockResolvedValue()
    const store = useTemplateEditorStore()
    await store.load(1)

    relabelTemplate(store, 'Engagement 2027')
    await store.saveContent()

    expect(vi.mocked(TemplateEditorService.updateLabel)).toHaveBeenCalledWith(1, 'Engagement 2027')
  })

  it('should leave the name alone when only the layout changed', async () => {
    vi.spyOn(TemplateEditorService, 'updateContent').mockResolvedValue()
    vi.spyOn(TemplateEditorService, 'updateLabel').mockResolvedValue()
    const store = useTemplateEditorStore()
    await store.load(1)

    retitleScreen(store, 'activite', 'Autre')
    await store.saveContent()

    expect(vi.mocked(TemplateEditorService.updateLabel)).not.toHaveBeenCalled()
  })

  it('should mark the version locked when a publication pins it', async () => {
    vi.spyOn(TemplateEditorService, 'updateContent')
      .mockRejectedValue({ response: { status: 409, data: { title: 'Template: state conflict' } } })
    const store = useTemplateEditorStore()
    await store.load(1)
    retitleScreen(store, 'activite', 'Autre')

    expect(await store.saveContent()).toBe(false)
    expect(store.isCurrentVersionLocked).toBe(true)
    expect(store.isDirty).toBe(true)
  })

  it('should keep the refusal of the microservice for the page to point at', async () => {
    vi.spyOn(TemplateEditorService, 'updateContent').mockRejectedValue({
      response: {
        status: 422,
        data: {
          code: 'unknown-citations',
          errors: [{ pointer: '/screens/0/widgets/0/lines/0/indicator', detail: 'inconnu' }],
        },
      },
    })
    const store = useTemplateEditorStore()
    await store.load(1)
    retitleScreen(store, 'activite', 'Autre')

    await store.saveContent()

    expect(store.serverError?.code).toBe('unknown-citations')
    expect(store.serverError?.entries).toHaveLength(1)

    // the next edit answers it
    retitleScreen(store, 'activite', 'Encore autre')
    expect(store.serverError).toBeUndefined()
  })

  it('should unlock the version once the changes were carried by a new one', async () => {
    vi.spyOn(TemplateEditorService, 'updateContent')
      .mockRejectedValue({ response: { status: 409, data: {} } })
    vi.spyOn(TemplateEditorService, 'addVersion').mockResolvedValue()
    const store = useTemplateEditorStore()
    await store.load(1)
    retitleScreen(store, 'activite', 'Autre')
    await store.saveContent()

    await store.saveVersion('1.1.1')

    expect(store.isCurrentVersionLocked).toBe(false)
    expect(store.currentVersion).toBe('1.1.1')
  })

  it('should delete a version and reopen on whichever one is left', async () => {
    vi.spyOn(TemplateEditorService, 'deleteVersion').mockResolvedValue()
    const store = useTemplateEditorStore()
    await store.load(1, '1.1.0')

    expect(await store.deleteVersion('1.1.0')).toBe(true)

    expect(vi.mocked(TemplateEditorService.deleteVersion)).toHaveBeenCalledWith(1, '1.1.0')
    expect(store.currentVersion).toBe('1.0.0')
  })

  it('should say why a version could not be deleted', async () => {
    vi.spyOn(TemplateEditorService, 'deleteVersion')
      .mockRejectedValue({ response: { status: 409, data: { title: 'Template: state conflict' } } })
    const store = useTemplateEditorStore()
    await store.load(1)

    expect(await store.deleteVersion('1.0.0')).toBe(false)
    expect(store.serverError?.title).toBe('Template: state conflict')
  })

  it('should save a version verbatim and stay on it, clean', async () => {
    vi.spyOn(TemplateEditorService, 'addVersion').mockResolvedValue()
    const store = useTemplateEditorStore()
    await store.load(1)
    retitleScreen(store, 'activite', 'Autre')

    const saved = await store.saveVersion('1.1.1')

    expect(saved).toBe(true)
    expect(vi.mocked(TemplateEditorService.addVersion))
      .toHaveBeenCalledWith(1, '1.1.1', expect.objectContaining({ id: 'engagement' }))
    expect(store.currentVersion).toBe('1.1.1')
    expect(store.isDirty).toBe(false)
  })

  it('should refuse to save a document with dropped elements', async () => {
    vi.mocked(TemplateEditorService.getRawContent)
      .mockResolvedValue({ id: 'x', label: 'X', version: '1', screens: ['bad'] })
    vi.spyOn(TemplateEditorService, 'addVersion').mockResolvedValue()
    const store = useTemplateEditorStore()
    await store.load(1)

    expect(store.hasBlockingWarnings).toBe(true)
    expect(await store.saveVersion('1.1.1')).toBe(false)
    expect(vi.mocked(TemplateEditorService.addVersion)).not.toHaveBeenCalled()
  })

  it('should make the current version visible', async () => {
    vi.spyOn(TemplateEditorService, 'setVisibleVersion').mockResolvedValue()
    const store = useTemplateEditorStore()
    await store.load(1, '1.1.0')

    await store.setVisible()

    expect(vi.mocked(TemplateEditorService.setVisibleVersion)).toHaveBeenCalledWith(1, '1.1.0')
    expect(store.isCurrentVersionVisible).toBe(true)
  })

  it.each([
    { code: 'engagement', document: keyMomentsEngagement },
    { code: 'tresorerie', document: keyMomentsTresorerie },
  ])('should write back the shipped $code template unchanged', async ({ document }) => {
    vi.mocked(TemplateEditorService.getRawContent).mockResolvedValue(structuredClone(document))
    vi.spyOn(TemplateEditorService, 'updateContent').mockResolvedValue()
    const store = useTemplateEditorStore()
    await store.load(1)

    await store.saveContent()

    expect(store.warnings).toEqual([])
    expect(vi.mocked(TemplateEditorService.updateContent).mock.calls[0][2]).toEqual(document)
  })
})
