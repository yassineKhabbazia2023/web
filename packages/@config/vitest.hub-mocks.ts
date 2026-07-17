// Shared factory bodies for the "hub mocks" every project setup registers
// worker-wide (see docs/guidelines/isolate-safe-tests.md).
//
// vi.mock itself MUST stay in each project's vitest.setup.ts: setup files are
// re-executed for every test file, while an imported module is evaluated only
// once per worker — a vi.mock living here would only cover the first file.
// Setups therefore register one-liners delegating to these factories:
//   vi.mock('@pulse/common/api', () => apiHubMock())
//   vi.mock('@pulse/toolbox', (importOriginal) => toolboxLoggerHubMock(importOriginal))
import { spyWrappedExports } from '@pulse/toolbox/mocks/spy-module.helper'

// Named exports a hub spy-wraps: each becomes a real-by-default shared spy,
// memoized under `cacheKey` (doctrine: shared-hubs), used by the toolbox hub below.
interface SpyWrapOptions {
  cacheKey: string
  exports: string[]
}

// Module-shaped mock for '@pulse/common/api': every spec of the worker
// converges on the shared api-gateway spies.
export function apiHubMock(): Promise<Record<string, unknown>> {
  return import('@pulse/common/mocks/vitest/api.mocks')
}

// 'env-vars' resolves to the canonical fixture so URL-based expectations are
// stable whatever the local .env contains.
export async function envVarsHubMock(): Promise<Record<string, unknown>> {
  return (await import('@pulse/common/mocks')).envVarsMock
}

// The toolbox keeps its real utils but its logger is replaced by the shared
// spies: specs assert on loggerMock without ever binding to the real logger.
// Projects that also stub a real util per test (useDebounce, isMobileDevice…)
// pass `spyWrap` to wrap those exports real-by-default in the same hub instead
// of re-declaring the logger override inline.
export async function toolboxLoggerHubMock(
  importOriginal: () => Promise<typeof import('@pulse/toolbox')>,
  options: { spyWrap?: SpyWrapOptions } = {},
): Promise<Record<string, unknown>> {
  const base = options.spyWrap
    ? await spyWrappedExports(options.spyWrap.cacheKey, importOriginal, options.spyWrap.exports)
    : await importOriginal()

  return {
    ...base,
    logger: (await import('@pulse/toolbox/mocks')).loggerMock,
  }
}

// AmplitudeService never reaches the real SDK in unit tests: every spec of
// the worker converges on the shared static-class mock.
export async function amplitudeHubMock(
  importOriginal: () => Promise<typeof import('@pulse/common/services/amplitude')>,
): Promise<Record<string, unknown>> {
  return {
    ...(await importOriginal()),
    AmplitudeService: (await import('@pulse/common/mocks/vitest')).AmplitudeServiceMock,
  }
}

// Module-shaped mock for the storage services: every spec of the worker
// converges on the shared local/session/cookie storage spies.
export function storageHubMock(): Promise<Record<string, unknown>> {
  return import('@pulse/common/mocks/vitest/storage.mocks')
}

// tokenIsValid keeps its real implementation by default (some specs validate
// real JWTs) but becomes a stable spy others can stub (memoized instance,
// doctrine: shared-hubs).
export async function tokenIsValidHubMock(
  importOriginal: () => Promise<typeof import('@pulse/common/stores')>,
): Promise<Record<string, unknown>> {
  return {
    ...(await importOriginal()),
    tokenIsValid: (await import('@pulse/common/mocks/vitest')).tokenIsValidMock,
  }
}

// Styleguide exports a project can swap for a shared inert/stable spy: each
// maps to the `<name>Mock` export of @pulse/common/mocks/vitest
// (doctrine: shared-hubs). Notifications never reach element-plus in the worker-shared jsdom
// document; specs assert on vi.mocked(...) and override per test.
type StyleguideReplaceableExport =
  | 'PNotification'
  | 'displayNotification'
  | 'getAvatarColorFromKey'
  | 'getEffectiveIsMobile'
  | 'getIsMobile'
  | 'useResponsive'

// The styleguide stays real except the exports a project opts to swap for a
// shared inert/stable spy, wired by name. Subsumes every per-project styleguide
// hub.
//   vi.mock('@pulse/styleguide', (io) => styleguideHubMock(io, { replace: ['PNotification'] }))
export async function styleguideHubMock(
  importOriginal: () => Promise<typeof import('@pulse/styleguide')>,
  options: { replace?: StyleguideReplaceableExport[] } = {},
): Promise<Record<string, unknown>> {
  const { replace = [] } = options
  const actual = await importOriginal()

  const sharedSpies = await import('@pulse/common/mocks/vitest') as Record<string, unknown>
  const replaced: Record<string, unknown> = {}
  for (const exportName of replace) {
    replaced[exportName] = sharedSpies[`${exportName}Mock`]
  }

  return { ...actual, ...replaced }
}

// The signalR SDK never builds a real connection in unit tests: the
// HubConnectionBuilder is replaced by the shared constructor spy (armed per
// test by the own-specs), everything else (LogLevel...) stays real.
export async function signalrHubMock(
  importOriginal: () => Promise<object>,
): Promise<Record<string, unknown>> {
  return {
    ...(await importOriginal()),
    HubConnectionBuilder: (await import('@pulse/common/mocks/vitest')).HubConnectionBuilderMock,
  }
}

// The MSAL SDK is mocked once for the whole worker so every spec and the
// frozen msal service binding converge on the same mock constructor.
export function msalBrowserHubMock(): Promise<Record<string, unknown>> {
  return import('./mocks/msal-browser.mocks')
}

// pdfjs-dist and the toolbox pdf-worker wiring never run under jsdom: both
// are inert module-shaped mocks shared by every spec of the worker.
export function pdfjsDistHubMock(): Promise<Record<string, unknown>> {
  return import('./mocks/pdfjs-dist.mocks')
}

export function pdfWorkerHubMock(): Promise<Record<string, unknown>> {
  return import('./mocks/pdf-worker.mocks')
}
