import type { Mock } from 'vitest'
import { stubStaticMethods } from './static-class.helper'

export const initializeCurrentEntityMock: Mock = vi.fn()
export const clearCurrentEntityMock: Mock = vi.fn()

export const CurrentEntityManagerMock = {
  initializeCurrentEntity: initializeCurrentEntityMock,
  clearCurrentEntity: clearCurrentEntityMock,
}

/**
 * Stubs every CurrentEntityManager method touched by the authenticated flow
 * managers with no-op spies on the real static class (doctrine: static-classes).
 *
 * Must be called (and awaited) per test, in a beforeEach: the spies created
 * by vi.spyOn are restored to the real methods before each test by the global
 * mock hygiene.
 *
 * The manager is imported lazily on purpose: this file is re-exported by the
 * mocks barrel, which is loaded from inside vi.mock factories — a
 * module-scope import of application code would reach mocked ids (the
 * invoices-access store imports @pulse/styleguide) and deadlock the pending
 * factory (doctrine: mock-barrel).
 */
export const stubCurrentEntityManager = async (): Promise<void> => {
  const { CurrentEntityManager } = await import('@pulse/common/managers')
  stubStaticMethods(CurrentEntityManager, [
    'initializeCurrentEntity',
    'getLocalStorageEntityId',
    'setLocalStorageEntityId',
    'clearLocalStorageEntityId',
    'clearCurrentEntity',
    'fetchInvoicesAccess',
  ])
}
