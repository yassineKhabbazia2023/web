import { setupWorker, type SetupWorker } from 'msw/browser'
import type { RequestHandler } from 'msw'
import type { AppType } from '../types'

let workerInstance: SetupWorker | null = null

/**
 * Creates a new MSW worker with the provided handlers
 * Use this if you need custom handlers for specific test scenarios
 */
export function createMswWorker(customHandlers: RequestHandler[]) {
  return setupWorker(...customHandlers)
}

/**
 * Creates a MSW worker configured for the specified app type
 * Uses dynamic imports to avoid loading unnecessary handlers
 * - customer: Uses all customer/collaborator handlers
 * - backoffice: Uses backoffice-specific handlers only
 */
export async function createAppWorker(appType: AppType) {
  if (appType === 'backoffice') {
    const { appSettingsHandlers } = await import('../handlers/backoffice')
    return setupWorker(...appSettingsHandlers)
  }

  const { handlers } = await import('../handlers')
  return setupWorker(...handlers)
}

/**
 * Creates pre-configured MSW worker with all default handlers (customer/collaborator)
 * Use this for Storybook and E2E testing
 */
export async function createDefaultWorker() {
  const { handlers } = await import('../handlers')
  return setupWorker(...handlers)
}

/**
 * Initializes and stores a singleton MSW worker instance
 * Use this for Storybook where the worker needs to be started once and accessed in stories
 */
export async function initializeWorker(basePath: string = '') {
  if (workerInstance) {
    return workerInstance
  }

  workerInstance = await createDefaultWorker()

  await workerInstance.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: `${basePath}/mockServiceWorker.js`,
    },
  })

  return workerInstance
}

/**
 * Returns the initialized MSW worker instance
 * Throws if initializeWorker() hasn't been called yet
 */
export function getWorker(): SetupWorker {
  if (workerInstance === null) {
    throw new Error('MSW worker not initialized. Call initializeWorker() first.')
  }
  return workerInstance
}
