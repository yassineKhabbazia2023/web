import type { Mock } from 'vitest'

export const setProviderAndWaitMock: Mock = vi.fn()
export const setContextMock: Mock = vi.fn()
export const getBooleanDetailsMock: Mock = vi.fn()
export const getStringDetailsMock: Mock = vi.fn()
export const getNumberDetailsMock: Mock = vi.fn()
export const getObjectDetailsMock: Mock = vi.fn()
export const configCatCreateMock: Mock = vi.fn(() => 'mocked-provider')
