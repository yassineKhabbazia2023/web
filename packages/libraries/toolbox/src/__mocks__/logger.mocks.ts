import type { Mock } from 'vitest'

export const loggerDebugSpy: Mock = vi.fn()
export const loggerInfoSpy: Mock = vi.fn()
export const loggerWarnSpy: Mock = vi.fn()
export const loggerErrorSpy: Mock = vi.fn()
export const loggerTraceSpy: Mock = vi.fn()

export const loggerMock = {
  debug: loggerDebugSpy,
  info: loggerInfoSpy,
  warn: loggerWarnSpy,
  error: loggerErrorSpy,
  trace: loggerTraceSpy,
}
