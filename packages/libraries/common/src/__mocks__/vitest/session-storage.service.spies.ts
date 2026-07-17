import type { Mock } from 'vitest'

export const setSamlSsoContextMock: Mock = vi.fn()
export const getSamlSsoContextMock: Mock = vi.fn()
export const removeSamlSsoContextMock: Mock = vi.fn()
export const hasSamlSsoContextMock: Mock = vi.fn()
export const consumeSamlSsoContextMock: Mock = vi.fn()
export const setRedirectContextMock: Mock = vi.fn()
export const consumeRedirectContextMock: Mock = vi.fn()

export const sessionStorageServiceMock = {
  setSamlSsoContext: setSamlSsoContextMock,
  getSamlSsoContext: getSamlSsoContextMock,
  removeSamlSsoContext: removeSamlSsoContextMock,
  hasSamlSsoContext: hasSamlSsoContextMock,
  consumeSamlSsoContext: consumeSamlSsoContextMock,
  setRedirectContext: setRedirectContextMock,
  consumeRedirectContext: consumeRedirectContextMock,
}
