export const copyMock = vi.fn((value) => value)
export const useClipboardMock = vi.fn(() => {
  return {
    copy: copyMock,
  }
})
export const useWindowSizeMock = vi.fn(() => {
  return {
    width: 1024,
    height: 768,
  }
})

export const vueuseCoreMock = {
  useClipboard: useClipboardMock,
  useWindowSize: useWindowSizeMock,
}
