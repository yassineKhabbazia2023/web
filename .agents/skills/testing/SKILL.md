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
- To mock the logger, use the auto mock: `vi.mock('@pulse/toolbox')` then assert with `vi.mocked(logger.error)`. Caveat: this mocks every export of the toolbox main entry (`useDebounce`, validator re-exports…) — if the tested code needs their real behavior, spread the original module and mock only the logger: `vi.mock('@pulse/toolbox', async (importOriginal) => ({ ...await importOriginal<object>(), logger: loggerMock }))` with `loggerMock` from `@pulse/toolbox/mocks`

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

## Mock Patterns

- **Use dedicated mock files**: Create mock data factories in `__mocks__/` folders (e.g., `getBookingServiceExpert()`) instead of inline test data
- **Use vitest auto mock pattern** with `vi.mock()` then `vi.mocked()`:

```typescript
// Good: Auto mock at top level
vi.mock('../../../services')
vi.mock('./my-manager')

// Then in tests, use vi.mocked() to configure behavior
it('should do something', async () => {
  vi.mocked(MyService.myMethod).mockResolvedValueOnce({ data: 'test' })

  // ... test code ...

  expect(vi.mocked(MyService.myMethod)).toHaveBeenCalledWith('expected')
})

// Bad: Manual mock implementation
vi.mock('../../../services', () => ({
  MyService: {
    myMethod: vi.fn(),
  },
}))
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
