/**
 * MSW bootstrap for selective dev mocking.
 * Loaded as a module by the Vite plugin when VITE_DEV_MOCKS=true.
 * Starts MSW with only the handlers defined in ./handlers.ts.
 * All non-mocked requests pass through to real APIs.
 */

import { createMswWorker } from '../msw/worker'
import { devMockHandlers } from './dev.handlers'

if (devMockHandlers.length === 0) {
  /* eslint-disable-next-line no-console */
  console.log('[MSW Dev] No dev mock handlers defined — skipping worker start')
} else {
  try {
    const worker = createMswWorker(devMockHandlers)

    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    })

    /* eslint-disable-next-line no-console */
    console.log(`[MSW Dev] Mocking ${devMockHandlers.length} endpoint(s)`)
  } catch (error) {
    /* eslint-disable-next-line no-console */
    console.error('[MSW Dev] Failed to start worker:', error)
  }
}
