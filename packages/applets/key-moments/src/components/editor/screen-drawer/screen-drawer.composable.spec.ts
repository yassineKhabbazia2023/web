import { createPinia, setActivePinia } from 'pinia'
import keyMomentsEngagement from '@key-moments/templates/key-moments.engagement.template.json'
import keyMomentsIndicators from '@key-moments/__mocks__/json/key-moments.indicators.json'
import { TemplateEditorService } from '@key-moments/services/template-editor.service'
import { IndicatorsService } from '@key-moments/services/indicators.service'
import { useTemplateEditorStore } from '@key-moments/stores/template-editor.store'
import { useScreenDrawer } from './screen-drawer.composable'
import type { Indicator } from '@key-moments/types/key-moments.types'

const VERSIONS = [{ version: '1.0.0', publishedAt: '2026-07-01', publishedBy: 'a', isVisible: true }]
/** A version no publication has read yet, which is where the ids may still be rewritten */
const DRAFT_VERSIONS = [{ version: '1.0.0', publishedAt: '2026-07-01', publishedBy: 'a', isVisible: false }]

/** The drawer open on a screen of the document, on the version asked. */
async function openOn(screenId: string, versions = DRAFT_VERSIONS) {
  vi.mocked(TemplateEditorService.getVersions).mockResolvedValue(versions)
  const store = useTemplateEditorStore()
  await store.load(1)
  store.select({ kind: 'screen', id: screenId })

  return { store, drawer: useScreenDrawer() }
}

/** The drawer open on a screen being created, which the document does not carry yet. */
async function startOn(title: string, versions = DRAFT_VERSIONS) {
  vi.mocked(TemplateEditorService.getVersions).mockResolvedValue(versions)
  const store = useTemplateEditorStore()
  await store.load(1)
  store.startScreen(title)

  return { store, drawer: useScreenDrawer() }
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.spyOn(TemplateEditorService, 'getVersions').mockResolvedValue(VERSIONS)
  vi.spyOn(TemplateEditorService, 'getRawContent').mockResolvedValue(structuredClone(keyMomentsEngagement))
  vi.spyOn(IndicatorsService, 'getIndicators')
    .mockResolvedValue(keyMomentsIndicators.indicators as unknown as Indicator[])
})

describe('useScreenDrawer', () => {

  it('should open on the selected screen and close by clearing the selection', async () => {
    const { store, drawer } = await openOn('activite')

    expect(drawer.isOpen.value).toBe(true)
    expect(drawer.id.value).toBe('activite')
    expect(drawer.title.value).toBe('Votre activité')

    drawer.cancel()

    expect(drawer.isOpen.value).toBe(false)
    expect(store.selection).toBeUndefined()
  })

  it('should render nothing when the selection is not a screen', async () => {
    const store = useTemplateEditorStore()
    await store.load(1)
    store.select({ kind: 'widget', id: 'synthese' })

    const drawer = useScreenDrawer()

    expect(drawer.isOpen.value).toBe(false)
    expect(drawer.screen.value).toBeUndefined()
    expect(drawer.title.value).toBe('')
  })

  it('should keep every edit out of the document until it is saved', async () => {
    const { store, drawer } = await openOn('activite')

    drawer.rename('Autre titre')

    expect(drawer.title.value).toBe('Autre titre')
    expect(store.findScreen('activite')?.title).toBe('Votre activité')
    expect(store.isDirty).toBe(false)

    drawer.save()

    expect(store.findScreen('activite')?.title).toBe('Autre titre')
    expect(store.isDirty).toBe(true)
    expect(store.selection).toBeUndefined()
  })

  it('should drop the subtitle when it is emptied', async () => {
    const { drawer } = await openOn('activite')

    drawer.setSubtitle('Un sous-titre')
    expect(drawer.subtitle.value).toBe('Un sous-titre')

    drawer.setSubtitle('')
    expect(drawer.screen.value).not.toHaveProperty('subtitle')
  })

  it('should carry the id along with the title as long as it was not authored', async () => {
    const { drawer } = await startOn('Annexes')

    expect(drawer.id.value).toBe('annexes')

    drawer.rename('Annexes comptables')

    expect(drawer.id.value).toBe('annexes-comptables')
    expect(drawer.draftIdError.value).toBeUndefined()
  })

  it('should stop following the title once the id was authored by hand', async () => {
    const { drawer } = await startOn('Annexes')

    drawer.setId('mes-annexes')
    drawer.rename('Annexes comptables')

    expect(drawer.id.value).toBe('mes-annexes')
  })

  it('should leave the id of a screen the author picked himself alone', async () => {
    const { drawer } = await openOn('activite')

    // « activite » is not what « Votre activité » offers: it was authored
    drawer.rename('Votre activité en 2026')

    expect(drawer.id.value).toBe('activite')
  })

  it('should keep the id off the ones the document already answers to', async () => {
    const { drawer } = await startOn('Synthèse')

    expect(drawer.id.value).toBe('synthese-2')

    drawer.rename('TBA')

    expect(drawer.id.value).toBe('tba-2')
  })

  it('should leave the id alone once the version on screen is published', async () => {
    const { drawer } = await startOn('Annexes', VERSIONS)

    expect(drawer.areIdsEditable.value).toBe(false)

    drawer.rename('Annexes comptables')

    expect(drawer.id.value).toBe('annexes')
  })

  it('should slugify the id when the field is left, not while it is written', async () => {
    const { drawer } = await startOn('Annexes')

    drawer.setId('Mes Annexes !')
    expect(drawer.id.value).toBe('Mes Annexes !')

    drawer.normalizeId()
    expect(drawer.id.value).toBe('mes-annexes')
  })

  it('should refuse to save an id another element already answers to', async () => {
    const { store, drawer } = await openOn('activite')

    drawer.setId('tba')

    expect(drawer.draftIdError.value).toBe('keyMoments.settings.editor.idTaken')

    drawer.save()

    expect(store.isDirty).toBe(false)
    expect(drawer.isOpen.value).toBe(true)
  })

  it('should refuse to save an emptied id', async () => {
    const { store, drawer } = await openOn('activite')

    drawer.setId('   ')

    expect(drawer.draftIdError.value).toBe('keyMoments.settings.editor.idInvalid')

    drawer.save()

    expect(store.isDirty).toBe(false)
    expect(drawer.isOpen.value).toBe(true)
  })
})
