// Deliberate doctrine: mock-barrel exception (module-level value-import): the binding is
// only dereferenced inside the helper, and the vue-i18n hub factory
// (spyWrappedExports) never loads this barrel back — cycle-safe. A lazy
// import would force every consumer spec to await this helper.
import type { Mock } from 'vitest'
import { useI18n } from 'vue-i18n'

// For projects whose vitest.setup.ts spy-wraps vue-i18n's useI18n: components and
// composables tested outside an active i18n app context get an identity mock so
// tests never assert on translated wording. `t` returns the raw key; the `d`/`n`
// formatters stringify their value, mirroring the real composer whose formatters
// always return a string — passing the raw value through instead handed `Date`
// and `number` objects to String-typed props, which Vue rejected at mount.
// Returns the armed composer so a spec can assert on the `t` spy (interpolated
// counts, plural key choice) instead of hand-rolling its own identity mock.
export function stubUseI18nWithIdentityT(): { t: Mock } {
  const t = vi.fn((key: string) => key)
  vi.mocked(useI18n).mockReturnValue({
    t,
    d: (value: unknown) => String(value),
    n: (value: unknown) => String(value),
  } as unknown as ReturnType<typeof useI18n>)

  return { t }
}

// Opt back into the real composer for the current test, undoing the worker-wide
// identity default armed by setupIsolateSafeGuards.
//
// Needed by specs mounting a component that registers a local scope
// (`useI18n({ useScope: 'local', messages })`) and renders <i18n-t>. <i18n-t>
// resolves its scope through vue-i18n's module-internal useI18n, which no module
// mock can reach: stubbing the exported useI18n stops the parent from ever
// registering that local scope, so <i18n-t> finds none and vue-i18n warns
// ("Not found parent scope") on every render. Restoring the real composer lets
// the scope register as it does in the app.
export function restoreRealUseI18n(): void {
  vi.mocked(useI18n).mockRestore()
}
