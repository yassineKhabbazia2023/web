import type { Mock } from 'vitest'

export const localStorageMock: {
  getItem: Mock
  setItem: Mock
  removeItem: Mock
} = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}
