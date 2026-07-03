import { waitForMsw } from './e2e.utils'

const globalFlags = globalThis as { __MSW_READY__?: boolean }

const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

describe('waitForMsw', () => {
  beforeEach(() => {
    delete globalFlags.__MSW_READY__
    consoleLogSpy.mockClear()
    consoleWarnSpy.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should resolve immediately when MSW is already ready', async () => {
    globalFlags.__MSW_READY__ = true

    await waitForMsw()

    expect(consoleLogSpy).toHaveBeenCalledWith('[E2E] MSW ready, initializing app')
  })

  it('should wait until MSW becomes ready', async () => {
    vi.useFakeTimers()
    setTimeout(() => {
      globalFlags.__MSW_READY__ = true
    }, 100)

    const waitPromise = waitForMsw()
    await vi.advanceTimersByTimeAsync(200)
    await waitPromise

    expect(consoleLogSpy).toHaveBeenCalledWith('[E2E] MSW ready, initializing app')
  })

  it('should warn and resolve when MSW is not ready within the timeout', async () => {
    vi.useFakeTimers()

    const waitPromise = waitForMsw(200)
    await vi.advanceTimersByTimeAsync(300)
    await waitPromise

    expect(consoleWarnSpy).toHaveBeenCalledWith('[E2E] MSW not ready after 200ms, continuing anyway')
  })
})
