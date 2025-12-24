import { setupWorker } from 'msw/browser'
import type { RequestHandler } from 'msw'
import { handlers } from '../handlers'

/**
 * Creates a new MSW worker with the provided handlers
 * Use this if you need custom handlers for specific test scenarios
 */
export function createMswWorker(customHandlers: RequestHandler[]) {
  return setupWorker(...customHandlers)
}

/**
 * Pre-configured MSW worker with all default handlers
 * Use this for Storybook and E2E testing
 */
export const worker = setupWorker(...handlers)
