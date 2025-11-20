import type { Mock } from 'vitest'

export const getEmailIsValidMock: Mock = vi.fn()

export const validatorUtilsMocks = {
  getEmailIsValid: getEmailIsValidMock,
}
