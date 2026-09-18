import { createPinia, setActivePinia } from 'pinia'
import { flushPromises } from '@vue/test-utils'
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from 'vue-router'
import { withSetup } from '@pulse/toolbox/utils/test'
import keyMomentsEngagement from '@key-moments/templates/key-moments.engagement.template.json'
import keyMomentsIndicators from '@key-moments/__mocks__/json/key-moments.indicators.json'
import { TemplateEditorService } from '@key-moments/services/template-editor.service'
import { IndicatorsService } from '@key-moments/services/indicators.service'
import { useTemplateEditorStore } from '@key-moments/stores/template-editor.store'
import { useTemplateEditor } from './template-editor.composable'
import type { Indicator } from '@key-moments/types/key-moments.types'

/** Edits a screen the way the page does: through its drawer. */
function retitleScreen(store: ReturnType<typeof useTemplateEditorStore>, screenId: string, title: string): void {
  store.select({ kind: 'screen', id: screenId })
  store.setDraft({ ...store.draft, title })
  store.commitDraft()
}

const VERSIONS = [
  { version: '1.1.0', publishedAt: '2026-08-01', publishedBy: 'a', isVisible: false },
  { version: '1.0.0', publishedAt: '2026-07-01', publishedBy: 'a', isVisible: true },
]

beforeEach(() => {
  setActivePinia(createPinia())
  vi.mocked(useRoute).mockReturnValue({ params: { templateId: '1' } } as never)
  vi.spyOn(TemplateEditorService, 'getVersions').mockResolvedValue(VERSIONS)
  vi.spyOn(TemplateEditorService, 'getRawContent').mockResolvedValue(structuredClone(keyMomentsEngagement))
  vi.spyOn(IndicatorsService, 'getIndicators')
    .mockResolvedValue(keyMomentsIndicators.indicators as unknown as Indicator[])
})

describe('useTemplateEditor', () => {

  it('should open the template of the route on mount', async () => {
    const [{ report, currentVersion }] = withSetup(() => useTemplateEditor())
    await flushPromises()

    expect(vi.mocked(TemplateEditorService.getVersions)).toHaveBeenCalledWith(1)
    expect(currentVersion.value).toBe('1.0.0')
    expect(report.value?.screens).toHaveLength(6)
  })

  it('should list every version, the visible one told apart', async () => {
    const [{ versionOptions }] = withSetup(() => useTemplateEditor())
    await flushPromises()

    expect(versionOptions.value.map(option => option.pValue)).toEqual(['1.1.0', '1.0.0'])
    expect(versionOptions.value[1].pLabel).not.toBe('1.0.0')
    expect(versionOptions.value[0].pLabel).toBe('1.1.0')
  })

  it('should save by rewriting the version on screen in place', async () => {
    vi.spyOn(TemplateEditorService, 'updateContent').mockResolvedValue()
    const [{ save }] = withSetup(() => useTemplateEditor())
    await flushPromises()
    retitleScreen(useTemplateEditorStore(), 'activite', 'Autre')

    await save()

    expect(vi.mocked(TemplateEditorService.updateContent))
      .toHaveBeenCalledWith(1, '1.0.0', expect.objectContaining({ id: 'engagement' }))
  })

  it('should propose the next patch version when asking for a new one', async () => {
    const [{ askNewVersion, isNewVersionDialogOpen, proposedVersion }] = withSetup(() => useTemplateEditor())
    await flushPromises()

    askNewVersion()

    expect(isNewVersionDialogOpen.value).toBe(true)
    expect(proposedVersion.value).toBe('1.1.1')
  })

  it('should create the version proposed and close the dialog', async () => {
    vi.spyOn(TemplateEditorService, 'addVersion').mockResolvedValue()
    const [{ askNewVersion, confirmNewVersion, isNewVersionDialogOpen }] = withSetup(() => useTemplateEditor())
    await flushPromises()

    askNewVersion()
    await confirmNewVersion()

    expect(vi.mocked(TemplateEditorService.addVersion))
      .toHaveBeenCalledWith(1, '1.1.1', expect.objectContaining({ id: 'engagement' }))
    expect(isNewVersionDialogOpen.value).toBe(false)
  })

  it('should keep the dialog open when the new version is refused', async () => {
    vi.spyOn(TemplateEditorService, 'addVersion').mockRejectedValue(new Error('nope'))
    const [{ askNewVersion, confirmNewVersion, isNewVersionDialogOpen }] = withSetup(() => useTemplateEditor())
    await flushPromises()

    askNewVersion()
    await confirmNewVersion()

    expect(isNewVersionDialogOpen.value).toBe(true)
  })

  it('should offer to delete a version only when it is neither visible nor the last one', async () => {
    const [{ canDeleteCurrentVersion }] = withSetup(() => useTemplateEditor())
    await flushPromises()

    // opened on the visible version
    expect(canDeleteCurrentVersion.value).toBe(false)
  })

  it('should delete a version only once the deletion is confirmed', async () => {
    vi.spyOn(TemplateEditorService, 'deleteVersion').mockResolvedValue()
    const [{ askDeleteVersion, pendingVersionDeletion, confirmDeleteVersion }] = withSetup(() => useTemplateEditor())
    await flushPromises()

    askDeleteVersion('1.1.0')
    expect(pendingVersionDeletion.value).toBe('1.1.0')
    expect(vi.mocked(TemplateEditorService.deleteVersion)).not.toHaveBeenCalled()

    await confirmDeleteVersion()

    expect(vi.mocked(TemplateEditorService.deleteVersion)).toHaveBeenCalledWith(1, '1.1.0')
    expect(pendingVersionDeletion.value).toBeUndefined()
  })

  it('should refuse to publish a document carrying unsaved changes', async () => {
    const [{ askVisible, isVisibleDialogOpen }] = withSetup(() => useTemplateEditor())
    await flushPromises()
    retitleScreen(useTemplateEditorStore(), 'activite', 'Autre')

    askVisible()

    expect(isVisibleDialogOpen.value).toBe(false)
  })

  it('should switch version straight away when nothing is unsaved', async () => {
    const [{ switchVersion }] = withSetup(() => useTemplateEditor())
    await flushPromises()

    switchVersion('1.1.0')
    await flushPromises()

    expect(vi.mocked(TemplateEditorService.getRawContent)).toHaveBeenLastCalledWith(1, '1.1.0')
  })

  it('should ask before dropping unsaved changes to switch version', async () => {
    const [{ switchVersion, isSwitchDialogOpen, confirmSwitch }] = withSetup(() => useTemplateEditor())
    await flushPromises()
    retitleScreen(useTemplateEditorStore(), 'activite', 'Autre')

    switchVersion('1.1.0')

    expect(isSwitchDialogOpen.value).toBe(true)
    expect(vi.mocked(TemplateEditorService.getRawContent)).toHaveBeenCalledTimes(1)

    confirmSwitch()
    await flushPromises()

    expect(vi.mocked(TemplateEditorService.getRawContent)).toHaveBeenLastCalledWith(1, '1.1.0')
  })

  it('should open the drawer on the widget it is adding, before the document carries it', async () => {
    const [{ addWidget, selection, report }] = withSetup(() => useTemplateEditor())
    await flushPromises()

    const widgetId = addWidget('activite', 0)

    expect(selection.value).toEqual({
      kind: 'widget',
      id: widgetId,
      creation: { screenId: 'activite', index: 0 },
    })
    expect(report.value?.screens.flatMap(screen => screen.widgets).map(widget => widget.id))
      .not.toContain(widgetId)
  })

  it('should remove an element only once the removal is confirmed', async () => {
    const [{ confirmRemoveWidget, pendingRemoval, applyRemoval, report }] = withSetup(() => useTemplateEditor())
    await flushPromises()

    confirmRemoveWidget('tba')
    expect(pendingRemoval.value).toEqual({ kind: 'widget', id: 'tba' })
    expect(report.value?.screens[0].widgets).toHaveLength(1)

    applyRemoval()

    expect(pendingRemoval.value).toBeUndefined()
    expect(report.value?.screens.flatMap(screen => screen.widgets).map(widget => widget.id))
      .not.toContain('tba')
  })

  /**
   * Both guards hold the same question: duplicating opens another template on
   * the same route, and drops the document on screen just as leaving does.
   */
  it.each([
    ['leaving the route', onBeforeRouteLeave],
    ['opening another template on the route', onBeforeRouteUpdate],
  ])('should ask before dropping unsaved changes when %s', async (_, registerGuard) => {
    let guard: (() => boolean | Promise<boolean>) | undefined
    vi.mocked(registerGuard).mockImplementation(((next: () => boolean | Promise<boolean>) => {
      guard = next
    }) as never)
    const [{ isLeaveDialogOpen, cancelLeave }] = withSetup(() => useTemplateEditor())
    await flushPromises()

    expect(guard?.()).toBe(true)

    retitleScreen(useTemplateEditorStore(), 'activite', 'Autre')
    const answer = guard?.()

    expect(isLeaveDialogOpen.value).toBe(true)

    cancelLeave()

    await expect(answer).resolves.toBe(false)
    expect(isLeaveDialogOpen.value).toBe(false)
  })

  it('should hand over the document on screen when asked to duplicate it', async () => {
    const [{ duplicationSource }] = withSetup(() => useTemplateEditor())
    await flushPromises()
    retitleScreen(useTemplateEditorStore(), 'activite', 'Autre')

    const source = duplicationSource()

    expect(source.label).toBe(keyMomentsEngagement.label)
    expect(source.content).toMatchObject({ id: 'engagement' })
  })
})
