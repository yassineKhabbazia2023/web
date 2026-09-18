import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { displayNotification } from '@pulse/styleguide'
import { TemplateEditorService } from '@key-moments/services/template-editor.service'
import { useTemplatesList } from './templates-list.composable'

const CATALOGUE = [
  { templateId: 1, code: 'engagement', label: 'Engagement', visibleVersion: '1.0.0' },
  { templateId: 2, code: 'brouillon', label: 'Brouillon', visibleVersion: null },
]

describe('useTemplatesList', () => {

  it('should read the whole catalogue on mount', async () => {
    vi.spyOn(TemplateEditorService, 'getCatalogue').mockResolvedValue(CATALOGUE)

    const [{ catalogue, isLoading }] = withSetup(() => useTemplatesList())
    await flushPromises()

    expect(catalogue.value).toEqual(CATALOGUE)
    expect(isLoading.value).toBe(false)
  })

  it('should tell the reader when the catalogue cannot be read', async () => {
    vi.spyOn(TemplateEditorService, 'getCatalogue').mockRejectedValue(new Error('nope'))

    const [{ catalogue, isLoading }] = withSetup(() => useTemplatesList())
    await flushPromises()

    expect(catalogue.value).toEqual([])
    expect(isLoading.value).toBe(false)
    expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', expect.any(String))
  })
})
