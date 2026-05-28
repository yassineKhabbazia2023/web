import type { Mock } from 'vitest'

export const getIconComponentMock: Mock = vi.fn()

export const iconHelperMock = {
  getIconComponent: getIconComponentMock,
}
