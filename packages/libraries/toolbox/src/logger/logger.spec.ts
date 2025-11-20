import { vi, describe, it, expect } from 'vitest'
import { logger } from './logger'

const mockedLoggerDebug = vi.hoisted(() => vi.fn((_: string) => _))
const mockedLoggerWarn = vi.hoisted(() => vi.fn((_: string) => _))
const mockedLoggerError = vi.hoisted(() => vi.fn((_: string) => _))

const mockedLoggerConstructor = vi.hoisted(() => vi.fn(function() {
  return {
    debug: mockedLoggerDebug,
    warn: mockedLoggerWarn,
    error: mockedLoggerError,
  }
}))

vi.mock('tslog', () => ({
  Logger: mockedLoggerConstructor,
}))

describe('logger', () => {
  it('should call Logger methods with proper args', () => {
    const debugMessage = 'debug message'
    const warnMessage = 'warn message'
    const errorMessage = 'error message'

    logger.debug(debugMessage)
    logger.warn(warnMessage)
    logger.error(errorMessage)

    expect(mockedLoggerDebug).toHaveBeenCalledOnce()
    expect(mockedLoggerDebug).toHaveBeenNthCalledWith(1, debugMessage)

    expect(mockedLoggerWarn).toHaveBeenCalledOnce()
    expect(mockedLoggerWarn).toHaveBeenNthCalledWith(1, warnMessage)

    expect(mockedLoggerError).toHaveBeenCalledOnce()
    expect(mockedLoggerError).toHaveBeenNthCalledWith(1, errorMessage)
  })
})
