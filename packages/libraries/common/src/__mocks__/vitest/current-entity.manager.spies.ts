import type { Mock } from 'vitest'

export const initializeCurrentEntityMock: Mock = vi.fn()
export const clearCurrentEntityMock: Mock = vi.fn()

export const CurrentEntityManagerMock = {
  initializeCurrentEntity: initializeCurrentEntityMock,
  clearCurrentEntity: clearCurrentEntityMock,
}
