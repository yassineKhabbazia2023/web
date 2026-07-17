import type { Mock } from 'vitest'

export const setCookieMock: Mock = vi.fn()
export const getCookieMock: Mock = vi.fn()
export const removeCookieMock: Mock = vi.fn()
export const consumeCookieMock: Mock = vi.fn()

export const cookieServiceMock = {
  set: setCookieMock,
  get: getCookieMock,
  remove: removeCookieMock,
  consume: consumeCookieMock,
}
