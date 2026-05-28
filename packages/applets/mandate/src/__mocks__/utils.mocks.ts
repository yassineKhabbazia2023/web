import type { Mock } from 'vitest'

export const dateFormatter: Mock = vi.fn()
export const downloadFile: Mock = vi.fn()
export const saveFileAs: Mock = vi.fn()

export const utilsMocks = {
  dateFormatter,
  downloadFile,
  saveFileAs,
}
