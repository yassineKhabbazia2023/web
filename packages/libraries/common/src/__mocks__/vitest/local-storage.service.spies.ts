import type { Mock } from 'vitest'

export const setTokenMock: Mock = vi.fn()
export const getTokenMock: Mock = vi.fn()
export const removeTokenMock: Mock = vi.fn()

export const localStorageServiceMock = {
  setToken: setTokenMock,
  getToken: getTokenMock,
  removeToken: removeTokenMock,
}
