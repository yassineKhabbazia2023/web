import {
  capturedTslogConfig,
  tslogDebugMock,
  tslogErrorMock,
  tslogWarnMock,
} from '../__mocks__/tslog.mocks'
import { logger } from './logger'

describe('logger', () => {
  it('should call Logger methods with proper args', () => {
    const debugMessage = 'debug message'
    const warnMessage = 'warn message'
    const errorMessage = 'error message'

    logger.debug(debugMessage)
    logger.warn(warnMessage)
    logger.error(errorMessage)

    expect(tslogDebugMock).toHaveBeenCalledOnce()
    expect(tslogDebugMock).toHaveBeenNthCalledWith(1, debugMessage)

    expect(tslogWarnMock).toHaveBeenCalledOnce()
    expect(tslogWarnMock).toHaveBeenNthCalledWith(1, warnMessage)

    expect(tslogErrorMock).toHaveBeenCalledOnce()
    expect(tslogErrorMock).toHaveBeenNthCalledWith(1, errorMessage)
  })

  it('should register an overwrite.mask hook that swaps null-prototype fields on Error args for stringifiable copies', () => {
    // Reproduces the axios 1.16 case: AxiosError.config is built with
    // Object.create(null), and tslog would later throw on String(error.config).
    const error = new Error('login failed') as Error & { config: Record<string, unknown> }
    error.config = Object.create(null)
    error.config.url = '/api/login'
    expect(() => String(error.config)).toThrow(TypeError)

    const mask = capturedTslogConfig.value?.overwrite?.mask
    expect(mask).toBeTypeOf('function')

    mask!([error])

    expect(() => String(error.config)).not.toThrow()
    expect(error.config.url).toBe('/api/login')
  })

  it('should leave string args untouched', () => {
    const mask = capturedTslogConfig.value?.overwrite?.mask
    const result = mask!(['hello', 'world'])

    expect(result).toEqual(['hello', 'world'])
  })

  it('should leave plain object args untouched', () => {
    const mask = capturedTslogConfig.value?.overwrite?.mask
    const plain = { foo: 'bar', nested: { value: 1 } }
    const result = mask!([plain])

    expect(result[0]).toBe(plain)
    expect(plain).toEqual({ foo: 'bar', nested: { value: 1 } })
  })

  it('should leave primitive and null args untouched', () => {
    const mask = capturedTslogConfig.value?.overwrite?.mask
    const result = mask!([42, true, null, undefined])

    expect(result).toEqual([42, true, null, undefined])
  })

  it('should return the same array reference it received', () => {
    const mask = capturedTslogConfig.value?.overwrite?.mask
    const args: unknown[] = ['hello', new Error('boom')]

    expect(mask!(args)).toBe(args)
  })

  it('should process multiple Error args in a single call', () => {
    const firstError = new Error('first') as Error & { config: Record<string, unknown> }
    firstError.config = Object.create(null)
    firstError.config.url = '/api/one'

    const secondError = new Error('second') as Error & { config: Record<string, unknown> }
    secondError.config = Object.create(null)
    secondError.config.url = '/api/two'

    const mask = capturedTslogConfig.value?.overwrite?.mask
    mask!([firstError, secondError])

    expect(() => String(firstError.config)).not.toThrow()
    expect(() => String(secondError.config)).not.toThrow()
  })

  it('should swallow serialization errors and leave the error untouched', () => {
    const error = new Error('boom') as Error & { payload: bigint }
    error.payload = 10n

    const mask = capturedTslogConfig.value?.overwrite?.mask

    expect(() => mask!([error])).not.toThrow()
    expect(error.payload).toBe(10n)
  })
})
