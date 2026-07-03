---
name: file-conventions
description: File naming conventions, folder structure, type naming, file responsibilities (managers, composables, etc.), SFC structure, and component splitting guidelines. Use when creating a new file, a new component, organizing code, or deciding where to place types, enums, or constants.
---

# File Conventions

## File Naming Convention

Always use **kebab-case** for files and folders — including new files added next to legacy PascalCase siblings (never rename the existing ones to match). The only exception is `@pulse/styleguide`, where components intentionally use PascalCase (`P<Name>/P<Name>.vue`): follow that convention when working there.

Files should be separated by responsibility using the following suffixes:

| Suffix | Purpose | Example |
|--------|---------|---------|
| `.vue` | Vue component (template + minimal script setup) | `booking-form.vue` |
| `.stories.ts` | Component story (CSF format, `Meta`/`StoryObj` from `@storybook/vue3-vite`) | `booking-form.stories.ts` |
| `.vue.spec.ts` | Component test (legacy — never create new ones, see the `testing` skill) | `booking-form.vue.spec.ts` |
| `.page.vue` | Page component | `booking.page.vue` |
| `.composable.ts` | Vue reactive logic, event handling, lifecycle hooks | `booking.composable.ts` |
| `.directive.ts` | Directive | `booking.directive.ts` |
| `.spec.ts` | Test file | `booking.manager.spec.ts` |
| `.mocks.ts` | Mock data | `booking.mocks.ts` |
| `.types.ts` | TypeScript interfaces and type definitions | `booking.types.ts` |
| `.enums.ts` | TypeScript enums and union types | `booking.enums.ts` |
| `.consts.ts` | Static values, configuration, default values | `booking.consts.ts` |
| `.service.ts` | Service | `booking.service.ts` |
| `.manager.ts` | Business logic, API calls, state transformations | `booking.manager.ts` |
| `.helpers.ts` | Helper | `booking.helpers.ts` |
| `.utils.ts` | Utility | `booking.utils.ts` |
| `.store.ts` | Pinia store | `booking.store.ts` |
| `.routes.ts` | Route definitions | `booking.routes.ts` |
| `.guard.ts` | Navigation guard | `booking.guard.ts` |
| `.interceptor.ts` | HTTP interceptor | `booking.interceptor.ts` |
| `.validation.ts` | Form validation rules and schemas | `booking.validation.ts` |

**Important**: Exported interfaces and types must always be declared in a dedicated `.types.ts` file in the same folder — never in `.manager.ts`, `.composable.ts`, `.vue`, or any other file. A type used only inside a single file can stay in that file, unexported. The moment another file needs it, move it to the `.types.ts` file instead of exporting it in place.

## Type Naming Conventions

Use **PascalCase** for all types and interfaces. Follow these naming patterns:

| Pattern | Usage | Example |
|---------|-------|---------|
| `[Feature]Props` | Component props | `BookingFormProps` |
| `[Feature]Emits` | Component emits | `BookingFormEmits` |
| `[Feature]Item` | Single entity/model | `BookingItem`, `UserItem` |
| `[Feature]Response` | API response | `BookingResponse` |
| `[Feature]Request` | API request payload | `BookingRequest` |
| `[Feature]State` | Store/composable state | `BookingState` |
| `[Feature]Options` | Configuration options | `BookingOptions` |

**Example `.types.ts` file**:

```typescript
// booking-form.types.ts

export interface BookingFormProps {
  bookingId: string
  isEditable?: boolean
}

export interface BookingFormEmits {
  (event: 'submit', payload: BookingItem): void
  (event: 'cancel'): void
}

export interface BookingItem {
  id: string
  title: string
  date: Date
  status: BookingStatus // from booking-form.enums.ts
}

export interface BookingResponse {
  data: BookingItem[]
  total: number
}
```

## File Structure

A component with related files (manager, composable, types, etc.) must be in its own dedicated folder containing all of them:

```
components/
  booking-form/
    booking-form.vue
    booking-form.manager.ts
    booking-form.manager.spec.ts
    booking-form.composable.ts
    booking-form.composable.spec.ts
    booking-form.consts.ts
    booking-form.enums.ts
    booking-form.types.ts
    booking-form.validation.ts
    booking-form.validation.spec.ts
  booking-list/
    booking-list.vue
    booking-list.manager.ts
    ...
```

**Exception**: a trivial single-file component (only a `.vue` file, no manager/composable/types) can live flat in the parent `components/` folder — unless every sibling component in that folder uses a dedicated folder; in that case match the siblings and create a folder too. Create the dedicated folder as soon as a second related file appears.

## File Responsibilities

**Managers (`.manager.ts`)**
- **MUST be exported as a class with static methods** (never standalone functions)
- Business logic, API calls and data fetching
- Complex calculations and state transformations
- No Vue-specific code (keep framework-agnostic)

```typescript
// Good: Class with static methods
export class BookingManager {
  static async fetchBooking(bookingId: string) {
    return await BookingService.getBooking(bookingId)
  }

  static async fetchBookings() {
    return await BookingService.getBookings()
  }

  static calculateTotal(items: BookingItem[]): number {
    return items.reduce((sum, item) => sum + item.price, 0)
  }
}

// Bad: Standalone functions
export function fetchBookings() { /* ... */ }
export function calculateTotal(items: BookingItem[]) { /* ... */ }
```

**Composables (`.composable.ts`)**
- Vue 3 reactive state (`ref`, `reactive`, `computed`)
- Event handlers and lifecycle hooks (`onMounted`, `onUnmounted`, etc.)
- Watch effects
- Must follow `use` prefix convention (e.g., `useBookingForm`)

```typescript
// booking-form.composable.ts
import { ref, computed, onMounted } from 'vue'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { BookingManager } from './booking-form.manager'
import type { BookingItem } from './booking-form.types'

export function useBookingForm(bookingId: string) {
  const booking = ref<BookingItem | null>(null)
  const isLoading = ref(false)

  const isValid = computed(() => isNotNullNorEmpty(booking.value?.title))

  async function loadBooking() {
    isLoading.value = true
    try {
      booking.value = await BookingManager.fetchBooking(bookingId)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    loadBooking()
  })

  return {
    booking,
    isLoading,
    isValid,
    loadBooking,
  }
}
```

**Constants (`.consts.ts`)** — Static configuration values, default values, magic strings/numbers

**Enums (`.enums.ts`)** — TypeScript enums and union types (e.g., `type Status = 'pending' | 'done'`)

## Import Conventions

Always separate type imports from value imports using `import type`:

```typescript
// Good: types on dedicated import type lines
import { ref, computed, onMounted } from 'vue'
import { BookingManager } from './booking-form.manager'
import type { BookingItem } from './booking-form.types'

// Bad: mixing values and types in the same import
import { ref, computed, onMounted, type Ref } from 'vue'
import { BookingManager, type BookingResponse } from './booking-form.manager'
```

## SFC Section Order

Always keep SFC sections in this order:

```vue

<template>
  <!-- 1. Template first -->
</template>

<script setup lang="ts">
// 2. Script second
</script>

<style scoped lang="scss">
/* 3. Style last */
</style>
```

## Component Splitting Guidelines

Split a component when **any** of these conditions is true:

- It owns both orchestration/state **and** substantial UI markup for multiple sections
- It has 3+ distinct UI sections (e.g., form, filters, list, footer)
- A template block is repeated or could become reusable (item rows, cards)

**Page/view components** should remain thin composition surfaces: layout, provider wiring, and feature composition. Do not place full feature implementations in page components.

**When splitting**, follow the feature folder pattern:

```
components/
  booking/
    booking.page.vue           # Thin: composes sub-components
    booking-filters/
      booking-filters.vue
      booking-filters.composable.ts
      ...
    booking-list/
      booking-list.vue
      booking-list-item.vue
      booking-list.manager.ts
      ...
    booking-form/
      booking-form.vue
      booking-form.composable.ts
      booking-form.manager.ts
      ...
```
