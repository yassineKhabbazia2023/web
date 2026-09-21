import { downloadFile, openDocumentInNewTab, getFileNameFromContentDisposition } from './downloadFiles.helper'

const createObjectURLMock = vi.hoisted(() => vi.fn())
const revokeObjectURLMock = vi.hoisted(() => vi.fn())

describe('downloadFile', () => {
  it('should create a download link and click on it', () => {
    const url = 'https://fakeUrl'
    const data:any = '12345'
    const fileName = 'test.txt'
    const appendChildSpy = vi.spyOn(window.document.body, 'appendChild')

    const expectedArgument = document.createElement('a')

    expectedArgument.target = '_blank'
    expectedArgument.href = url
    expectedArgument.download = fileName
    expectedArgument.type = 'application/octet-stream'

    createObjectURLMock.mockImplementation((_: Blob | MediaSource) => url)
    window.URL.createObjectURL = createObjectURLMock
    window.URL.revokeObjectURL = revokeObjectURLMock

    downloadFile(data, fileName)

    expect(createObjectURLMock).toHaveBeenCalledWith(new Blob([data]))
    expect(window.document.body.appendChild).toHaveBeenCalledWith(
      expect.any(HTMLAnchorElement),
    )
    expect(appendChildSpy).toHaveBeenCalledWith(expectedArgument)
  })

  it('should clean up the link and revoke the object URL after the download', () => {
    const url = 'https://fakeUrl'
    createObjectURLMock.mockImplementation((_: Blob | MediaSource) => url)
    window.URL.createObjectURL = createObjectURLMock
    window.URL.revokeObjectURL = revokeObjectURLMock
    const removeSpy = vi.spyOn(HTMLAnchorElement.prototype, 'remove')

    downloadFile('12345', 'test.txt')

    expect(removeSpy).toHaveBeenCalled()
    expect(revokeObjectURLMock).toHaveBeenCalledWith(url)
  })
})

describe('openDocumentInNewTab', () => {
  const buildTabMock = () => ({ opener: {} as unknown, location: { href: '' }, close: vi.fn() })

  beforeEach(() => {
    createObjectURLMock.mockReset()
    revokeObjectURLMock.mockReset()
    window.URL.createObjectURL = createObjectURLMock
    window.URL.revokeObjectURL = revokeObjectURLMock
  })

  it('should open the document in a new tab and revoke the url after a delay', async () => {
    vi.useFakeTimers()
    const tabMock = buildTabMock()
    const windowOpenSpy = vi.fn().mockReturnValue(tabMock)
    vi.stubGlobal('open', windowOpenSpy)
    createObjectURLMock.mockReturnValue('blob:mocked-url')
    const documentBlob = new Blob()
    const fetchDocument = vi.fn().mockResolvedValue(documentBlob)

    const result = await openDocumentInNewTab(fetchDocument)

    expect(result).toBe(true)
    expect(windowOpenSpy).toHaveBeenCalledWith('', '_blank')
    expect(tabMock.opener).toBeNull()
    expect(createObjectURLMock).toHaveBeenCalledWith(documentBlob)
    expect(tabMock.location.href).toBe('blob:mocked-url')
    expect(revokeObjectURLMock).not.toHaveBeenCalled()

    vi.runAllTimers()

    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mocked-url')
    vi.useRealTimers()
  })

  it('should return false and not fetch the document when the popup is blocked', async () => {
    vi.stubGlobal('open', vi.fn().mockReturnValue(null))
    const fetchDocument = vi.fn()

    const result = await openDocumentInNewTab(fetchDocument)

    expect(result).toBe(false)
    expect(fetchDocument).not.toHaveBeenCalled()
  })

  it('should close the tab and rethrow when the fetch fails', async () => {
    const tabMock = buildTabMock()
    vi.stubGlobal('open', vi.fn().mockReturnValue(tabMock))
    const fetchDocument = vi.fn().mockRejectedValue(new Error('boom'))

    await expect(openDocumentInNewTab(fetchDocument)).rejects.toThrow('boom')
    expect(tabMock.close).toHaveBeenCalledOnce()
  })
})

describe('getFileNameFromContentDisposition', () => {
  const defaultFileName = 'default.zip'

  it.each([
    ['attachment; filename="documents.zip"', 'documents.zip'],
    ['attachment; filename=documents.zip', 'documents.zip'],
    [
      'attachment; filename=documents-rydge-conseil_17-09-2026.zip; filename*=UTF-8\'\'documents-rydge-conseil_17-09-2026.zip',
      'documents-rydge-conseil_17-09-2026.zip',
    ],
    ['attachment; filename*=UTF-8\'\'d%C3%A9claration%20fiscale.zip', 'déclaration fiscale.zip'],
    ['attachment; filename="fallback.zip"; filename*=UTF-8\'\'%E0%A4%A.zip', 'fallback.zip'],
  ])('should extract the file name from "%s"', (contentDisposition, expectedFileName) => {
    expect(getFileNameFromContentDisposition(contentDisposition, defaultFileName)).toBe(expectedFileName)
  })

  it.each([
    undefined,
    '',
    'attachment',
    'attachment; filename=""',
  ])('should return the default file name when content disposition is "%s"', (contentDisposition) => {
    expect(getFileNameFromContentDisposition(contentDisposition, defaultFileName)).toBe(defaultFileName)
  })
})
