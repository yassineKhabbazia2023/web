/**
 * Waits for MSW to be ready before continuing
 * This should be called at the top of your app's main.ts in E2E mode
 * to ensure API mocks are active before the app makes any requests
 */
export async function waitForMsw(options: { timeout?: number } = {}) {
  const { timeout = 10000 } = options
  const startTime = Date.now()

  while ((globalThis as any).__MSW_READY__ !== true) {
    if (Date.now() - startTime > timeout) {
      /* eslint-disable-next-line no-console */
      console.warn(`[E2E] MSW not ready after ${timeout}ms, continuing anyway`)
      return
    }
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  /* eslint-disable-next-line no-console */
  console.log('[E2E] MSW ready, initializing app')
}
