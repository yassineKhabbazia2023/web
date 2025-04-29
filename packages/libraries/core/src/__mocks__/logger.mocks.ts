export const loggerDebugSpy = vi.fn()
export const loggerWarnSpy = vi.fn()
export const loggerErrorSpy = vi.fn()
export const loggerTraceSpy = vi.fn()

export const loggerMock = {
  debug: loggerDebugSpy,
  warn: loggerWarnSpy,
  error: loggerErrorSpy,
  trace: loggerTraceSpy,
}
