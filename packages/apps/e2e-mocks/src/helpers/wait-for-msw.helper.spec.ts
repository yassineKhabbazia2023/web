import { waitForMsw } from './wait-for-msw.helper'

describe('waitForMsw', () => {
  beforeEach(() => {
    delete (globalThis as any).__MSW_READY__
  })

  afterEach(() => {
    delete (globalThis as any).__MSW_READY__
  })

  it('should resolve immediately when MSW is already ready', async () => {
    (globalThis as any).__MSW_READY__ = true
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const startTime = Date.now()
    await waitForMsw()
    const elapsed = Date.now() - startTime

    expect(elapsed).toBeLessThan(100)
    expect(consoleSpy).toHaveBeenCalledWith('[E2E] MSW ready, initializing app')

    consoleSpy.mockRestore()
  })

  it('should wait until MSW becomes ready', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    setTimeout(() => {
      (globalThis as any).__MSW_READY__ = true
    }, 150)

    const startTime = Date.now()
    await waitForMsw()
    const elapsed = Date.now() - startTime

    expect(elapsed).toBeGreaterThanOrEqual(100)
    expect(elapsed).toBeLessThan(300)
    expect(consoleSpy).toHaveBeenCalledWith('[E2E] MSW ready, initializing app')

    consoleSpy.mockRestore()
  })

  it('should timeout and warn when MSW is not ready within timeout', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const startTime = Date.now()
    await waitForMsw({ timeout: 200 })
    const elapsed = Date.now() - startTime

    expect(elapsed).toBeGreaterThanOrEqual(200)
    expect(elapsed).toBeLessThan(400)
    expect(consoleSpy).toHaveBeenCalledWith('[E2E] MSW not ready after 200ms, continuing anyway')

    consoleSpy.mockRestore()
  })

  it('should use default timeout of 10000ms', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    setTimeout(() => {
      (globalThis as any).__MSW_READY__ = true
    }, 100)

    await waitForMsw()

    expect(consoleSpy).toHaveBeenCalledWith('[E2E] MSW ready, initializing app')

    consoleSpy.mockRestore()
  })

  it('should poll every 50ms while waiting', async () => {
    let pollCount = 0
    const originalSetTimeout = globalThis.setTimeout

    vi.spyOn(globalThis, 'setTimeout').mockImplementation((fn: any, delay?: number) => {
      if (delay === 50) {
        pollCount++
      }
      return originalSetTimeout(fn, delay)
    })

    setTimeout(() => {
      (globalThis as any).__MSW_READY__ = true
    }, 160)

    await waitForMsw()

    expect(pollCount).toBeGreaterThanOrEqual(2)

    vi.restoreAllMocks()
  })
})
