import { debounce, dateFormatter, downloadFile } from './utils'
import { expect, describe, it, vi } from 'vitest'

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

    const window: any = {
      URL: {
        createObjectURL: createObjectURLMock,
        revokeObjectURL: revokeObjectURLMock
      }
    }

    // Mock document.createElement
    document.createElement = vi.fn().mockReturnValue({
      setAttribute: setAttributeMock,
      click: clickMock,
      href: ''
    })

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
    expect(appendChildMock).toHaveBeenCalled()
    expect(clickMock).toHaveBeenCalled()
    expect(revokeObjectURLMock).toHaveBeenCalled()
    expect(removeChildMock).toHaveBeenCalled()
  })
})
