---
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

## Testing Guidelines

- Use Vitest for all testing
- Do **not** test `.vue` files, only `.ts` files
- Do not `beforeEach(() => { vi.clearAllMocks() })` if it's not absolutely needed
- Do not import vi stuff (`import { describe, it, expect, beforeEach, vi } from 'vitest'`) — already globally available
- Mutualize mocks outside of `describe` blocks when possible, do not repeat mocks unless necessary
- Test all public methods and computed properties
- Test edge cases and error scenarios

## Testing Utilities

- Use `getStoreMock` from `@pulse/common/mocks/vitest` for Pinia store mocks
- Use `withSetup` from `@pulse/toolbox/utils/test` when testing composables with lifecycle hooks

## Async Testing Patterns

When testing async code, always properly await and flush promises:

```typescript
import { flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'

it('should handle async operations', async () => {
  vi.mocked(MyService.fetchData).mockResolvedValueOnce({ items: [] })

  const { result } = withSetup(() => useMyComposable())

  // Wait for all pending promises to resolve
  await flushPromises()

  expect(result.isLoading.value).toBe(false)
  expect(result.items.value).toEqual([])
})

it('should update reactive state', async () => {
  const { result } = withSetup(() => useMyComposable())

  result.updateValue('new')

  // Wait for Vue reactivity to flush
  await nextTick()

  expect(result.computedProp.value).toBe('new-derived')
})
```

## Composable Testing Patterns

Composables with lifecycle hooks (`onMounted`, `onUnmounted`, etc.) **must** use `withSetup`:

```typescript
it('should load data on mount', async () => {
  vi.mocked(MyManager.fetchItems).mockResolvedValueOnce([{ id: '1' }])

  const { result } = withSetup(() => useMyComposable())
  await flushPromises()

  expect(result.items.value).toHaveLength(1)
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
