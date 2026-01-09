/**
 * MSW bootstrap file for E2E testing
 * This file is loaded as a module in E2E mode to initialize MSW
 * Supports both customer/collaborator and backoffice apps via __MSW_APP_TYPE__ global
 */

import type { SetupWorker } from 'msw/browser'
import { http, HttpResponse } from 'msw'
import type { AppType } from '../types'
import { createAppWorker } from './worker'

declare global {
  var __MSW_APP_TYPE__: AppType
  var __MSW_READY__: boolean
  var __MSW_WORKER__: SetupWorker
  var __MSW__: { http: typeof http; HttpResponse: typeof HttpResponse }
}

const appType: AppType = globalThis.__MSW_APP_TYPE__ || 'customer'
const isBackoffice = appType === 'backoffice'
const logPrefix = isBackoffice ? '[MSW Bootstrap Backoffice]' : '[MSW Bootstrap]'

/* eslint-disable-next-line no-console */
console.log(`${logPrefix} Script loaded`)

try {
  /* eslint-disable-next-line no-console */
  console.log(`${logPrefix} Creating worker...`)

  const worker = await createAppWorker(appType)

  /* eslint-disable-next-line no-console */
  console.log(`${logPrefix} Starting worker...`)
  await worker.start({
    onUnhandledRequest: 'bypass',
  })

  /* eslint-disable-next-line no-console */
  console.log(`${logPrefix} Worker started, warming up...`)

  // Make a request to an actual mocked endpoint to ensure Service Worker is actively intercepting
  const warmupUrl = isBackoffice ? '/mock-api/keys' : '/contact/me'
  try {
    const warmupResponse = await fetch(warmupUrl)
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
  console.log(`[MSW] Mock Service Worker started for ${isBackoffice ? 'Backoffice ' : ''}E2E testing`)
} catch (error) {
  /* eslint-disable-next-line no-console */
  console.error(`${logPrefix} Error:`, error)
}
