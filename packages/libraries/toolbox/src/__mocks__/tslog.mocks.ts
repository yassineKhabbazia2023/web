import type { Mock } from 'vitest'

export const tslogSillyMock: Mock = vi.fn()
export const tslogTraceMock: Mock = vi.fn()
export const tslogDebugMock: Mock = vi.fn()
export const tslogInfoMock: Mock = vi.fn()
export const tslogWarnMock: Mock = vi.fn()
export const tslogErrorMock: Mock = vi.fn()
export const tslogFatalMock: Mock = vi.fn()

// The constructor config is captured in a plain holder (not a mock) so it
// survives the mock clearing that runs between tests: the logger singleton is
// built once, at import time.
export const capturedTslogConfig: { value?: { overwrite?: { mask?: (args: unknown[]) => unknown[] } } } = {}

// Module-shaped mock for 'tslog', registered by vitest.setup.ts. Not exported
// from index.ts on purpose: it mirrors the tslog surface.
export const Logger: Mock = vi.fn(function(config: unknown) {
  capturedTslogConfig.value = config as typeof capturedTslogConfig.value
  return {
    silly: tslogSillyMock,
    trace: tslogTraceMock,
    debug: tslogDebugMock,
    info: tslogInfoMock,
    warn: tslogWarnMock,
    error: tslogErrorMock,
    fatal: tslogFatalMock,
  }
})
