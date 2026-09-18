import { nextTick, ref } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { withSetup } from '@pulse/toolbox/utils/test'
import { useKeyMomentsEditionStore } from '../../stores/key-moments-edition.store'
import { useCommentBoxEdition } from './comment-box.composable'
import type { SaveSettlement } from '../../types/key-moments.types'

const onSave = vi.fn<(draftText: string, settle: SaveSettlement) => void>()

function setupEdition(initialText?: string) {
  const isEditing = ref(false)
  const text = ref<string | undefined>(initialText)
  const [edition, app] = withSetup(() => useCommentBoxEdition(isEditing, text, onSave))

  return { isEditing, text, app, ...edition }
}

function getLastSettle(): SaveSettlement {
  return onSave.mock.calls.at(-1)![1]
}

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('useCommentBoxEdition', () => {
  it('should count an open edition while the encart is being written in', async () => {
    const { isEditing } = setupEdition()
    const editionStore = useKeyMomentsEditionStore()

    isEditing.value = true
    await nextTick()

    expect(editionStore.hasOpenEdition).toBe(true)

    isEditing.value = false
    await nextTick()

    expect(editionStore.hasOpenEdition).toBe(false)
  })

  it('should release the edition when unmounted while writing', async () => {
    const { isEditing, app } = setupEdition()
    const editionStore = useKeyMomentsEditionStore()

    isEditing.value = true
    await nextTick()
    app.unmount()

    expect(editionStore.hasOpenEdition).toBe(false)
  })

  it('should not release another encart\'s edition when unmounted closed', () => {
    const { app } = setupEdition()
    const editionStore = useKeyMomentsEditionStore()
    editionStore.openEdition()

    app.unmount()

    expect(editionStore.hasOpenEdition).toBe(true)
  })

  it('should seed the draft with the text on opening', async () => {
    const { draft, toggleEdition } = setupEdition('Texte existant')

    toggleEdition()
    await nextTick()

    expect(draft.value).toBe('Texte existant')
  })

  it('should seed an empty draft when there is no text', async () => {
    const { draft, toggleEdition } = setupEdition()

    toggleEdition()
    await nextTick()

    expect(draft.value).toBe('')
  })

  it('should seed the text switched in the same tick as the opening', async () => {
    const { draft, isEditing, text } = setupEdition('Ancien texte')

    text.value = 'Nouveau texte'
    isEditing.value = true
    await nextTick()

    expect(draft.value).toBe('Nouveau texte')
  })

  it('should save the draft and close once the save is confirmed', async () => {
    const { draft, isEditing, isSaving, toggleEdition } = setupEdition('Texte')

    toggleEdition()
    await nextTick()
    draft.value = 'Texte modifié'
    toggleEdition()

    expect(onSave).toHaveBeenCalledExactlyOnceWith('Texte modifié', expect.any(Function))
    expect(isSaving.value).toBe(true)
    expect(isEditing.value).toBe(true)

    getLastSettle()(true)

    expect(isSaving.value).toBe(false)
    expect(isEditing.value).toBe(false)
  })

  it('should stay open on what was typed when the save fails', async () => {
    const { draft, isEditing, isSaving, toggleEdition } = setupEdition('Texte')

    toggleEdition()
    await nextTick()
    draft.value = 'Texte modifié'
    toggleEdition()
    getLastSettle()(false)
    await nextTick()

    expect(isSaving.value).toBe(false)
    expect(isEditing.value).toBe(true)
    expect(draft.value).toBe('Texte modifié')
  })

  it('should ignore toggles while a save is pending', async () => {
    const { isEditing, toggleEdition } = setupEdition('Texte')

    toggleEdition()
    await nextTick()
    toggleEdition()
    toggleEdition()

    expect(onSave).toHaveBeenCalledOnce()
    expect(isEditing.value).toBe(true)
  })
})
