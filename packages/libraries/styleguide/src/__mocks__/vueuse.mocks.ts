import { ref } from 'vue'

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
export const useStorageMock = vi.fn((_key: string, defaultValue: unknown) => ref(defaultValue))

export const vueuseCoreMock = {
  useClipboard: useClipboardMock,
  useWindowSize: useWindowSizeMock,
  useStorage: useStorageMock,
}
