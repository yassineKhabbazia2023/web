import { dateFormatter, downloadFile, saveFileAs } from './utils'

interface Window {
  showSaveFilePicker: any
  URL: any
}
declare let window: Window

describe('utils helpers', () => {
  it('should format date accordingly', () => {
    const dateFormatted = dateFormatter(
      '2022-07-27T00:00:00')
    expect(dateFormatted).toBe('27/07/2022')
  })

  it('creates a link and triggers a download', () => {
    // Setup mocks
    const createObjectURLMock = vi.fn()
    const revokeObjectURLMock = vi.fn()
    const appendChildMock = vi.fn()
    const clickMock = vi.fn()
    const setAttributeMock = vi.fn()
    // Spy the static methods on the real URL: replacing the constructor
    // would break the import-time `new URL(...)` of files collected while
    // this test runs (collection is pipelined on a shared worker).
    vi.spyOn(URL, 'createObjectURL').mockImplementation(createObjectURLMock)
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(revokeObjectURLMock)

    const removeMock = vi.fn()
    const createElementSpy: any = vi.spyOn(document, 'createElement')
    createElementSpy.mockImplementation(() => ({
      setAttribute: setAttributeMock,
      click: clickMock,
      remove: removeMock,
    }))
    // spyOn (restored before the next test) instead of a direct overwrite: the
    // document.body is shared by the whole worker in no-isolate.
    vi.spyOn(document.body, 'appendChild').mockImplementation(appendChildMock)

    // Execute the function
    const filename = 'testfile.txt'
    const data = 'Hello, World!'
    downloadFile(filename, data, window)

    // Assertions
    expect(createObjectURLMock).toHaveBeenCalledWith(new Blob([data]))
    expect(document.createElement).toHaveBeenCalledWith('a')
    expect(setAttributeMock).toHaveBeenCalledWith('download', filename)
    expect(appendChildMock).toHaveBeenCalledOnce()
    expect(clickMock).toHaveBeenCalledOnce()

    expect(removeMock).toHaveBeenCalledOnce()
    expect(revokeObjectURLMock).toHaveBeenCalledOnce()
  })
  it('saves file with a prompt folder selection', async () => {
    const showSaveFilePickerMock = vi.fn(() => Promise.resolve({
      createWritable: vi.fn(() => Promise.resolve({
        write: vi.fn(),
        close: vi.fn(),
      })),
    }))
    // stubGlobal (auto-unstubbed after each test) instead of a direct window
    // assignment: the jsdom window is shared by the whole worker in no-isolate.
    vi.stubGlobal('showSaveFilePicker', showSaveFilePickerMock)

    // Execute the function
    await saveFileAs('123-34531-13-134085', { mock: 'blabla' }, 'signed')
    // Assertions
    expect(showSaveFilePickerMock).toHaveBeenCalledWith({
      suggestedName: 'signed-mandate-123-34531-13-134085.pdf',
      types: [{
        description: 'PDF Document',
        accept: { 'application/pdf': ['.pdf'] },
      }],
    })
  })
})
