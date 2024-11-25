 
import { debounce, dateFormatter, downloadFile, saveFileAs } from './utils'
import { expect, describe, it, vi } from 'vitest'

interface Window {
  showSaveFilePicker: any
  URL: any
}
declare let window: Window

describe('utils helpers', () => {
  it('should emit once after 500ms', async () => {
    vi.useFakeTimers()
    const mockFunction = vi.fn()
    const functionDebounced = debounce(mockFunction)
    functionDebounced(23)
    functionDebounced(54)
    await vi.advanceTimersByTimeAsync(550)
    expect(mockFunction).toHaveBeenCalledTimes(1)
  })
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
    const removeChildMock = vi.fn()
    const clickMock = vi.fn()
    const setAttributeMock = vi.fn()
    window.URL = {
      createObjectURL: createObjectURLMock,
      revokeObjectURL: revokeObjectURLMock,
    }

    const createElementSpy: any = vi.spyOn(document, 'createElement')
    createElementSpy.mockImplementation(() => ({
      setAttribute: setAttributeMock,
      click: clickMock,
    }))
    // Mock document.body.appendChild and removeChild
    document.body.appendChild = appendChildMock
    document.body.removeChild = removeChildMock

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
     
    expect(revokeObjectURLMock).toHaveBeenCalledOnce()
  })
  it('saves file with a prompt folder selection', async () => {
    window.showSaveFilePicker = vi.fn(() => Promise.resolve({
      createWritable: vi.fn(() => Promise.resolve({
        write: vi.fn(),
        close: vi.fn(),
      })),
    }))

    // Execute the function
    await saveFileAs('123-34531-13-134085', { mock: 'blabla' }, 'signed')
    // Assertions
    expect(window.showSaveFilePicker).toHaveBeenCalledWith({
      suggestedName: 'signed-mandate-123-34531-13-134085.pdf',
      types: [{
        description: 'PDF Document',
        accept: { 'application/pdf': ['.pdf'] },
      }],
    })
  })
})
