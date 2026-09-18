import { TemplateEditorService } from '@key-moments/services/template-editor.service'
import { useTemplateCreateDrawer } from './template-create-drawer.composable'

const ITEM = {
  templateId: 3,
  code: 'nouveau-gabarit',
  label: 'Nouveau',
  visibleVersion: null,
}

const SOURCE = {
  label: 'Engagement',
  content: { id: 'engagement', label: 'Engagement', version: '2.0.0', screens: [1], extra: true },
}

function setup() {
  const onCreated = vi.fn()

  return { ...useTemplateCreateDrawer({ onCreated }), onCreated }
}

describe('useTemplateCreateDrawer', () => {

  it('should create an empty template from a code and a label', async () => {
    vi.spyOn(TemplateEditorService, 'createTemplate').mockResolvedValue(ITEM)
    const { openNew, form, save, onCreated, isOpen } = setup()

    openNew()
    form.code = 'Nouveau gabarit'
    form.label = 'Nouveau'
    await save()

    expect(vi.mocked(TemplateEditorService.createTemplate)).toHaveBeenCalledWith({
      code: 'nouveau-gabarit',
      label: 'Nouveau',
      version: '1.0.0',
      content: {
        id: 'nouveau-gabarit',
        label: 'Nouveau',
        screens: [],
      },
    })
    expect(onCreated).toHaveBeenCalledWith(ITEM)
    expect(isOpen.value).toBe(false)
  })

  it('should duplicate a content with its id and label rewritten, and no version', async () => {
    vi.spyOn(TemplateEditorService, 'createTemplate').mockResolvedValue(ITEM)
    const { openDuplicate, form, save } = setup()

    openDuplicate(SOURCE)
    form.code = 'engagement-copie'
    form.label = 'Engagement (copie)'
    await save()

    expect(vi.mocked(TemplateEditorService.createTemplate).mock.calls[0][0].content).toEqual({
      id: 'engagement-copie',
      label: 'Engagement (copie)',
      screens: [1],
      extra: true,
    })
  })

  it('should prefill the label of a duplicate from the template it copies', () => {
    const { openDuplicate, form } = setup()

    openDuplicate(SOURCE)

    expect(form.label).not.toBe('')
    expect(form.code).toBe('')
  })

  it('should put a refused code on the field rather than nowhere', async () => {
    vi.spyOn(TemplateEditorService, 'createTemplate')
      .mockRejectedValue({ response: { status: 409, data: { title: 'Code déjà utilisé' } } })
    const { openNew, form, save, codeError, isOpen } = setup()

    openNew()
    form.code = 'engagement'
    form.label = 'Engagement'
    await save()

    expect(codeError.value).toBe('Code déjà utilisé')
    expect(isOpen.value).toBe(true)
  })

  it('should send nothing without a code and a label', async () => {
    vi.spyOn(TemplateEditorService, 'createTemplate').mockResolvedValue(ITEM)
    const { openNew, save } = setup()

    openNew()
    await save()

    expect(vi.mocked(TemplateEditorService.createTemplate)).not.toHaveBeenCalled()
  })
})
