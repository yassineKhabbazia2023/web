import { api } from '@pulse/common/api'
import { TemplateEditorService } from './template-editor.service'

const CATALOGUE = [
  { templateId: 1, code: 'engagement', label: 'Engagement', visibleVersion: '1.0.0' },
  { templateId: 2, code: 'brouillon', label: 'Brouillon', visibleVersion: null },
]

describe('TemplateEditorService', () => {
  it('should list every template, hidden ones included', async () => {
    vi.mocked(api.gateway.get).mockResolvedValueOnce({ data: CATALOGUE })

    const catalogue = await TemplateEditorService.getCatalogue()

    expect(vi.mocked(api.gateway.get))
      .toHaveBeenCalledWith('keymoments/api/templates', { params: { includeHidden: true } })
    expect(catalogue).toEqual(CATALOGUE)
  })

  /**
   * The route without `includeHidden` names the visible version `version`, and
   * a template hidden altogether names none: both read as the same absence.
   */
  it('should read the visible version whichever key the catalogue names it by', async () => {
    vi.mocked(api.gateway.get).mockResolvedValueOnce({
      data: [
        { templateId: 1, code: 'engagement', label: 'Engagement', version: '1.0.0' },
        { templateId: 2, code: 'brouillon', label: 'Brouillon' },
      ],
    })

    const catalogue = await TemplateEditorService.getCatalogue()

    expect(catalogue).toEqual([
      { templateId: 1, code: 'engagement', label: 'Engagement', visibleVersion: '1.0.0' },
      { templateId: 2, code: 'brouillon', label: 'Brouillon', visibleVersion: null },
    ])
  })

  it('should read the versions of a template', async () => {
    vi.mocked(api.gateway.get).mockResolvedValueOnce({ data: [{ version: '1.1.0', isVisible: false }] })

    await TemplateEditorService.getVersions(1)

    expect(vi.mocked(api.gateway.get)).toHaveBeenCalledWith('keymoments/api/templates/1/versions')
  })

  it('should read a content verbatim, of the visible version when none is named', async () => {
    const document = { id: 'engagement', screens: [], somethingUnknown: 42 }
    vi.mocked(api.gateway.get).mockResolvedValueOnce({ data: document })

    const content = await TemplateEditorService.getRawContent(1)

    expect(vi.mocked(api.gateway.get))
      .toHaveBeenCalledWith('keymoments/api/templates/1/content', { params: { version: undefined } })
    expect(content).toBe(document)
  })

  it('should create a template', async () => {
    vi.mocked(api.gateway.post).mockResolvedValueOnce({ data: CATALOGUE[1] })
    const payload = { code: 'brouillon', label: 'Brouillon', version: '1.0.0', content: { id: 'brouillon' } }

    const created = await TemplateEditorService.createTemplate(payload)

    expect(vi.mocked(api.gateway.post)).toHaveBeenCalledWith('keymoments/api/templates', payload)
    expect(created).toEqual(CATALOGUE[1])
  })

  it('should add a version without activating it', async () => {
    vi.mocked(api.gateway.post).mockResolvedValueOnce({ data: undefined })

    await TemplateEditorService.addVersion(1, '1.1.0', { id: 'engagement' })

    expect(vi.mocked(api.gateway.post))
      .toHaveBeenCalledWith('keymoments/api/templates/1/versions', { version: '1.1.0', content: { id: 'engagement' } })
  })

  it('should write the content of a version in place', async () => {
    vi.mocked(api.gateway.put).mockResolvedValueOnce({ data: undefined })

    await TemplateEditorService.updateContent(1, '1.1.0', { id: 'engagement' })

    expect(vi.mocked(api.gateway.put)).toHaveBeenCalledWith(
      'keymoments/api/templates/1/versions/1.1.0/content',
      { id: 'engagement' },
    )
  })

  it('should rename a template across every one of its versions', async () => {
    vi.mocked(api.gateway.put).mockResolvedValueOnce({ data: undefined })

    await TemplateEditorService.updateLabel(1, 'Engagement 2027')

    expect(vi.mocked(api.gateway.put))
      .toHaveBeenCalledWith('keymoments/api/templates/1', { label: 'Engagement 2027' })
  })

  it('should take a template out of the catalogue', async () => {
    vi.mocked(api.gateway.delete).mockResolvedValueOnce({ data: undefined })

    await TemplateEditorService.clearVisibleVersion(1)

    expect(vi.mocked(api.gateway.delete)).toHaveBeenCalledWith('keymoments/api/templates/1/visible')
  })

  it('should delete a version', async () => {
    vi.mocked(api.gateway.delete).mockResolvedValueOnce({ data: undefined })

    await TemplateEditorService.deleteVersion(1, '1.1.0')

    expect(vi.mocked(api.gateway.delete))
      .toHaveBeenCalledWith('keymoments/api/templates/1/versions/1.1.0')
  })

  it('should switch the visible version', async () => {
    vi.mocked(api.gateway.put).mockResolvedValueOnce({ data: undefined })

    await TemplateEditorService.setVisibleVersion(1, '1.1.0')

    expect(vi.mocked(api.gateway.put))
      .toHaveBeenCalledWith('keymoments/api/templates/1/visible', undefined, { params: { version: '1.1.0' } })
  })
})
