// Single implementation of the memoized spy-wrap helpers (doctrine:
// shared-hubs, contested-modules). It lives in toolbox — the bottom of the
// dependency stack — so every project reaches it in the right direction
// through `@pulse/toolbox/mocks/spy-module.helper`, and every worker shares
// the very same module (hence the same memoization caches).

// Wraps every function export of a module in a vi.fn keeping the real
// implementation; non-function exports are passed through untouched.
function wrapFunctionExports(realModule: Record<string, unknown>): Record<string, unknown> {
  const wrapped: Record<string, unknown> = {}
  for (const exportName of Object.keys(realModule)) {
    const exportValue = realModule[exportName]
    if (typeof exportValue === 'function') {
      wrapped[exportName] = vi.fn(exportValue as (...args: unknown[]) => unknown)
    } else {
      wrapped[exportName] = exportValue
    }
  }

  return wrapped
}

// Builds (once per worker) a spy-wrapped copy of a real module: every function
// export becomes a vi.fn wrapping the real implementation. The cache is keyed by
// the real module namespace object — stable per worker under isolate: false —
// so every test file (and every frozen importer) shares the exact same spy
// instances, with no hand-written cache key to keep unique. Pass it straight as
// a vi.mock factory: `vi.mock('./x', (io) => spyWrappedModule(io))`.
//
// The `mockReset: true` base config restores the implementation given to
// vi.fn(impl) before every test, so the wrapped exports come back real on
// their own (spec-level stubs run afterwards, in hooks or in the test).
const wrappedModulesCache = new WeakMap<object, Record<string, unknown>>()

export async function spyWrappedModule(
  importOriginal: () => Promise<unknown>,
): Promise<Record<string, unknown>> {
  const realModule = await importOriginal() as Record<string, unknown>
  const cached = wrappedModulesCache.get(realModule)
  if (cached !== undefined) {
    return cached
  }

  const wrapped = wrapFunctionExports(realModule)
  wrappedModulesCache.set(realModule, wrapped)
  return wrapped
}

// Partial spy-wrap for a module that must otherwise stay real: only the named
// exports become shared spies (real by default), everything else is passed
// through untouched. The synthetic subset can't key the WeakMap (a fresh object
// per call), so this variant keeps an explicit cacheKey. Meant for setup-level
// hubs on third-party or barrel modules where wrapping every export would be
// wasteful or unsafe:
//   vi.mock('vue-i18n', (importOriginal) =>
//     spyWrappedExports('entities/vue-i18n', importOriginal, ['useI18n']))
const wrappedExportsCache = new Map<string, Record<string, unknown>>()

export async function spyWrappedExports(
  cacheKey: string,
  importOriginal: () => Promise<unknown>,
  exportNames: string[],
): Promise<Record<string, unknown>> {
  const actual = await importOriginal() as Record<string, unknown>
  let wrapped = wrappedExportsCache.get(cacheKey)
  if (wrapped === undefined) {
    const subset: Record<string, unknown> = {}
    for (const exportName of exportNames) {
      subset[exportName] = actual[exportName]
    }

    wrapped = wrapFunctionExports(subset)
    wrappedExportsCache.set(cacheKey, wrapped)
  }

  return { ...actual, ...wrapped }
}

// Arms a spy-wrapped module with a spec's behavioral defaults: consumer specs
// re-apply their legacy mock implementations on the shared wrapper spies per
// test instead of registering local vi.mock factories (which would diverge
// from the instances frozen into already-evaluated importers).
export function armModuleMocks(
  wrappedModule: Record<string, unknown>,
  behavioralMocks: Record<string, (...args: never[]) => unknown>,
): void {
  // Some legacy mock objects carry extra keys that never existed on the real
  // module: accessing them on the mocked namespace would throw.
  const moduleExportNames = new Set(Object.keys(wrappedModule))
  for (const [exportName, behavioralMock] of Object.entries(behavioralMocks)) {
    if (moduleExportNames.has(exportName) === false) {
      continue
    }
    const wrappedExport = wrappedModule[exportName]
    if (vi.isMockFunction(wrappedExport)) {
      wrappedExport.mockImplementation(behavioralMock as (...args: unknown[]) => unknown)
    }
  }
}
