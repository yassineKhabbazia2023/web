---
name: testing
description: Unit testing requirements, Vitest guidelines, mock patterns, and testing utilities for composables, managers, and validation files. Use when writing or modifying tests, or when creating/modifying a .manager.ts, .composable.ts, or .validation.ts file.
---

# Unit Testing Requirements

**MANDATORY**: When creating or modifying these file types, you MUST write corresponding unit tests:

| File Type | Test File |
|-----------|-----------|
| `*.composable.ts` | `*.composable.spec.ts` |
| `*.manager.ts` | `*.manager.spec.ts` |
| `*.validation.ts` | `*.validation.spec.ts` |

## Testing Approach

- **Black-box testing**: Test behavior and outputs, not implementation details. Tests should not break when refactoring internals.
- Test what the function **does** (return values, side effects, emitted events), not **how** it does it.
- Avoid asserting on internal state or private methods.

## Testing Attributes

- Use `data-testid` for test selectors (not `data-test-id`)
- **When**: every new or modified interactive element (button, input, link, select/dropdown) and every container targeted by an E2E test (drawer, table, row, card) must carry a `data-testid`
- **Naming**: kebab-case, prefixed by the domain/feature, suffixed by the element role (`-button`, `-input`, `-drawer`, `-table`, `-list`, `-link`). Examples: `information-save-button`, `prospect-search-input`
- **Dynamic values**: use `:data-testid` with a stable domain id/key, never a loop index, e.g. `` :data-testid="`collaborator-item-${collaborator.contactId}`" ``
- **Styleguide components**: do not hardcode a `data-testid` on the tag — pass the `pTestId` prop when the component exposes one (it forwards it to `data-testid`)

## Testing Guidelines

- Use Vitest for all testing
- Do **not** create tests for `.vue` files, only for `.ts` files. Existing human-written `.vue.spec.ts` files are legitimate: never flag them in review or delete them, and if your change breaks one, update it — just never create a new one
- Do not `beforeEach(() => { vi.clearAllMocks() })` if it's not absolutely needed
- Do not import vi stuff (`import { describe, it, expect, beforeEach, vi } from 'vitest'`) — already globally available
- Mutualize mocks outside of `describe` blocks when possible, do not repeat mocks unless necessary
- Test all public methods and computed properties
- Test edge cases and error scenarios

## Testing Utilities

- Use `getStoreMock` from `@pulse/common/mocks/vitest` for Pinia store mocks
- Use `withSetup` from `@pulse/toolbox/utils/test` when testing composables with lifecycle hooks
- The logger is hub-mocked worker-wide by the shared setup (`packages/@config/vitest.setup.hubs.ts`, `toolboxLoggerHubMock`): never re-mock `@pulse/toolbox` in a spec, just assert with `vi.mocked(logger.error)` (with `logger` imported from `@pulse/toolbox`)

## Async Testing Patterns

When testing async code, always properly await and flush promises:

```typescript
import { flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'

it('should handle async operations', async () => {
  vi.mocked(MyService.fetchData).mockResolvedValueOnce({ items: [] })

  const [{ isLoading, items }] = withSetup(() => useMyComposable())

  // Wait for all pending promises to resolve
  await flushPromises()

  expect(isLoading.value).toBe(false)
  expect(items.value).toEqual([])
})

it('should update reactive state', async () => {
  const [{ updateValue, computedProp }] = withSetup(() => useMyComposable())

  updateValue('new')

  // Wait for Vue reactivity to flush
  await nextTick()

  expect(computedProp.value).toBe('new-derived')
})
```

## Composable Testing Patterns

Composables with lifecycle hooks (`onMounted`, `onUnmounted`, etc.) **must** use `withSetup`:

```typescript
it('should load data on mount', async () => {
  vi.mocked(MyManager.fetchItems).mockResolvedValueOnce([{ id: '1' }])

  const [{ items }] = withSetup(() => useMyComposable())
  await flushPromises()

  expect(items.value).toHaveLength(1)
  expect(vi.mocked(MyManager.fetchItems)).toHaveBeenCalledOnce()
})
```

Composables **without** lifecycle hooks can be called directly:

```typescript
it('should calculate total', () => {
  const { total, addItem } = useCartCalculator()

  addItem({ price: 10 })
  addItem({ price: 20 })

  expect(total.value).toBe(30)
})
```

## Isolate-Safe Testing (vitest `isolate: false`)

Workers are shared between test files — full doctrine (7 laws) in
`docs/guidelines/isolate-safe-tests.md`. What it means when writing a spec:

- **Specs never call `vi.mock`** (enforced by ESLint). Every module mock lives
  in a setup file: the universal hubs (`@pulse/common/api`, toolbox logger,
  `env-vars`, Amplitude) in the shared `packages/@config/vitest.setup.hubs.ts`,
  everything else in the project's `vitest.setup.ts` (spy-wrapped via
  `spyWrappedModule`). To mock a new module, add a one-liner to the project
  setup — never to the spec.
- **Configure behavior per test** with `vi.mocked(...)` in a `beforeEach` or in
  the test itself, never at module scope or in a `beforeAll` — every mock is
  reset (`mockReset: true`) before every test.
- **Static-class services/managers**: stub with a per-test
  `vi.spyOn(MyService, 'myMethod')`, never a module mock.
- **Spy-wrapped ("contested") modules** are real by default; consumer specs
  stub them per test via `vi.mocked(fn).mockXxx(...)`, or re-apply legacy
  automock behaviors with `armModuleMocks` from
  `@pulse/toolbox/mocks/spy-module.helper`.
- **Never wipe worker-shared state**: no `window.location` reassignment, no
  `document.body.innerHTML = ''`; use `vi.stubGlobal`/`vi.stubEnv` (restored
  automatically) and remove only the DOM nodes the spec added.
- The only tolerated spec-level `vi.mock` is the id-split of an own-spec (a
  spec escaping a fully-faked hub to test the real module) — it carries an
  explicit `eslint-disable` with a `doctrine:` justification.

## Mock Patterns

- **Use dedicated mock files**: Create mock data factories in `__mocks__/` folders (e.g., `getBookingServiceExpert()`) instead of inline test data
- **Module mocks live in setup files, never in specs.** There is no per-spec decision to make — a spec only does two things:

```typescript
// vitest.setup.ts — the ONLY place a vi.mock lives (spy-wrapped: real by
// default, stubbable per test)
vi.mock('./src/services/my-service', (importOriginal) => spyWrappedModule(importOriginal))
```

```typescript
// In the spec: arm behaviors per test with vi.mocked()
it('should do something', async () => {
  vi.mocked(MyService.myMethod).mockResolvedValueOnce({ data: 'test' })

  // ... test code ...

  expect(vi.mocked(MyService.myMethod)).toHaveBeenCalledWith('expected')
})

// And for static-class services/managers: vi.spyOn per test
beforeEach(() => {
  vi.spyOn(LogoutService, 'logout').mockResolvedValue()
})
```

## Running Tests

Each workspace's `test` script is `vitest run`. Always scope to the workspace — never run tests on the entire repository:

```bash
# Whole workspace
npm run test --workspace=@pulse/entities

# Single file (path or filename filter after --)
npm run test --workspace=@pulse/entities -- src/path/booking.manager.spec.ts
```

Never use `npx vitest --workspace=...` — that flag does not exist in Vitest 4.
