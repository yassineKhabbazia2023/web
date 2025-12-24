/**
 * MSW bootstrap file for E2E testing
 * This file is loaded as a module in E2E mode to initialize MSW
 */

import type { SetupWorker } from 'msw/browser'
import { http, HttpResponse } from 'msw'

declare global {

  var __MSW_READY__: boolean
  var __MSW_WORKER__: SetupWorker
  var __MSW__: { http: typeof http; HttpResponse: typeof HttpResponse }
}

/* eslint-disable-next-line no-console */
console.log('[MSW Bootstrap] Script loaded')

try {
  /* eslint-disable-next-line no-console */
  console.log('[MSW Bootstrap] Importing worker...')
  const { worker } = await import('./worker') as { worker: SetupWorker }

  /* eslint-disable-next-line no-console */
  console.log('[MSW Bootstrap] Starting worker...')
  await worker.start({
    onUnhandledRequest: 'bypass',
  })

  /* eslint-disable-next-line no-console */
  console.log('[MSW Bootstrap] Worker started, warming up...')

  // Make a request to an actual mocked endpoint to ensure Service Worker is actively intercepting
  try {
    const warmupResponse = await fetch('/contact/me')
    await warmupResponse.text()
  } catch {
    // Ignore errors - this is just to warm up the SW
  }

  // Set global flag for E2E tests to check
  globalThis.__MSW_READY__ = true

  // Expose worker and MSW utilities for runtime handler overrides in E2E tests
  globalThis.__MSW_WORKER__ = worker
  globalThis.__MSW__ = { http, HttpResponse }

  /* eslint-disable-next-line no-console */
  console.log('[MSW] Mock Service Worker started for E2E testing')
} catch (error) {
  /* eslint-disable-next-line no-console */
  console.error('[MSW Bootstrap] Error:', error)
}
