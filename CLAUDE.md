# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Build and Development

- **Start Customer app**: `npm run dev --workspace=@pulse/customer` — Launches Customer on http://localhost:9000
- **Start Collaborator app**: `npm run dev --workspace=@pulse/collaborator` — Launches Collaborator on http://localhost:9000/collaborateur/
- **Build Customer**: `npm run build --workspace=@pulse/customer`
- **Build Collaborator**: `npm run build --workspace=@pulse/collaborator`
- **Build all workspaces**: `npm run build:all`
- **Build types only**: `npm run build:types`

### Testing

- **Run all tests**: `npm run test`
- **Run tests with coverage**: `npm run test:coverage`
- **Run tests on changed files**: `npm run test:changed` (diff from origin/main)

### Code Quality

- **Lint code**: `npm run lint`
- **Fix linting issues**: `npm run lint:fix`

### Documentation and Tools

- **View documentation**: `npm run docs:dev`
- **Storybook**: `npm run storybook` (port 6009)
- **Generate styleguide assets**: `npm run styleguide:generate`

## Architecture Overview

### Monorepo Structure

This is an npm workspaces monorepo with three main package categories:

1. **Apps** (`packages/apps/`): Vue 3 applications
   - `customer` (`@pulse/customer`): Client-facing app with Gigya authentication, served at `/`
   - `collaborator` (`@pulse/collaborator`): Internal collaborator app with MSAL SSO, served at `/collaborateur/`
   - Both apps orchestrate routing, authentication flows, and layout components
   - Both integrate all applets and libraries

2. **Applets** (`packages/applets/`): Feature-specific micro-applications
   - `entities`: Entity management and business logic
   - `ged`: Document management system (GED)
   - `launcher`: Application launcher interface
   - `login`: Authentication flows
   - `mandate`: Mandate management workflows
   - `offers-catalog`: Product catalog functionality
   - `pennylane`: Pennylane integration
   - `powerbi`: PowerBI reporting integration

3. **Libraries** (`packages/libraries/`): Shared code and components
   - `common`: Core services, API clients, stores, and utilities
   - `toolbox`: Fundamental utilities, logging, feature flags
   - `styleguide`: Design system components and assets
   - `widgets`: Widget system for configurable dashboards

### Key Technical Patterns

- **State Management**: Pinia stores for global state
- **API Integration**: Centralized through API Gateway with axios interceptors
- **Authentication**: MSAL for collaborator SSO, Gigya for client authentication, token management in authentication service
- **Routing**: Vue Router with guards for authentication, permissions, and feature flags
- **Component Architecture**: Atomic design (atoms, molecules, organisms), Composition API with TypeScript, story-driven development with Histoire/Storybook
- **Build System**: Vite with custom configurations per workspace

## Code Conventions

### Language

- All comments must be written in **English**

### Coding Standards

- Unless explicitly stated, we don't care about retrocompatibility. This project is self-sufficient
- Use explicit, descriptive variable names (can be long if needed)
- Prioritize Styleguide CSS classes (based on element-plus)
- Never write CSS classes for basic styles (flex, margin, etc.) unless they don't exist in the StyleGuide
- ESLint configuration enforces formatting rules (2-space indentation, no semicolons, single quotes)
- No falsy values: use `test === false` instead of `!test`, same with `true`. For nullish checks, use `value === null || value === undefined` (or `value == null`) instead of `!value`

### CSS Class Formatting

When using more than 2 CSS classes, use multi-line format:

```vue
<!-- ✅ Good: More than 2 classes, use multi-line -->
<div
  class="
    first-class
    second-class
    third-class
  "
/>

<!-- ✅ Good: 1-2 classes, inline is fine -->
<div class="first-class second-class" />

<!-- ❌ Bad: More than 2 classes on single line -->
<div class="first-class second-class third-class" />
```

### File Naming Convention

Always use **kebab-case** for files and folders. Files should be separated by responsibility using the following suffixes:

| Suffix | Purpose | Example |
|--------|---------|---------|
| `.vue` | Vue component (template + minimal script setup) | `booking-form.vue` |
| `.story.vue` | Component story | `booking-form.story.vue` |
| `.vue.spec.ts` | Component test | `booking-form.vue.spec.ts` |
| `.page.vue` | Page component | `booking.page.vue` |
| `.composable.ts` | Vue reactive logic, event handling, lifecycle hooks | `booking.composable.ts` |
| `.directive.ts` | Directive | `booking.directive.ts` |
| `.spec.ts` | Test file | `booking.manager.spec.ts` |
| `.mocks.ts` | Mock data | `booking.mocks.ts` |
| `.type.ts` | TypeScript interfaces and type definitions | `booking.type.ts` |
| `.enum.ts` | TypeScript enums and union types | `booking.enum.ts` |
| `.const.ts` | Static values, configuration, default values | `booking.const.ts` |
| `.service.ts` | Service | `booking.service.ts` |
| `.manager.ts` | Business logic, API calls, state transformations | `booking.manager.ts` |
| `.helper.ts` | Helper | `booking.helper.ts` |
| `.util.ts` | Utility | `booking.util.ts` |
| `.store.ts` | Pinia store | `booking.store.ts` |
| `.route.ts` | Route definitions | `booking.route.ts` |
| `.guard.ts` | Navigation guard | `booking.guard.ts` |
| `.interceptor.ts` | HTTP interceptor | `booking.interceptor.ts` |
| `.validation.ts` | Form validation rules and schemas | `booking.validation.ts` |

**Important**: Interfaces and types must NEVER be declared inside `.manager.ts`, `.composable.ts`, or other files. They must always be in a dedicated `.type.ts` file in the same folder.

### Type Naming Conventions

Use **PascalCase** for all types and interfaces. Follow these naming patterns:

| Pattern | Usage | Example |
|---------|-------|---------|
| `[Feature]Props` | Component props | `BookingFormProps` |
| `[Feature]Emits` | Component emits | `BookingFormEmits` |
| `[Feature]Item` | Single entity/model | `BookingItem`, `UserItem` |
| `[Feature]List` | Array/collection type | `BookingList` |
| `[Feature]Response` | API response | `BookingResponse` |
| `[Feature]Request` | API request payload | `BookingRequest` |
| `[Feature]State` | Store/composable state | `BookingState` |
| `[Feature]Options` | Configuration options | `BookingOptions` |

**Example `.type.ts` file**:

```typescript
// booking-form.type.ts

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
  status: BookingStatus // from booking-form.enum.ts
}

export interface BookingResponse {
  data: BookingItem[]
  total: number
}
```

### File Structure

Each component must be in its own dedicated folder containing all its related files:

```
components/
  booking-form/
    booking-form.vue
    booking-form.manager.ts
    booking-form.manager.spec.ts
    booking-form.composable.ts
    booking-form.composable.spec.ts
    booking-form.const.ts
    booking-form.enum.ts
    booking-form.type.ts
    booking-form.validation.ts
    booking-form.validation.spec.ts
    index.ts
  booking-list/
    booking-list.vue
    booking-list.manager.ts
    ...
```

### File Responsibilities

**Managers (`.manager.ts`)**
- **MUST be exported as a class with static methods** (never standalone functions)
- Business logic, API calls and data fetching
- Complex calculations and state transformations
- No Vue-specific code (keep framework-agnostic)

```typescript
// ✅ Good: Class with static methods
export class BookingManager {
  static async fetchBookings() {
    return await BookingService.getBookings()
  }

  static calculateTotal(items: BookingItem[]): number {
    return items.reduce((sum, item) => sum + item.price, 0)
  }
}

// ❌ Bad: Standalone functions
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
import { BookingManager } from './booking-form.manager'
import type { BookingItem } from './booking-form.type'

export function useBookingForm(bookingId: string) {
  const booking = ref<BookingItem | null>(null)
  const isLoading = ref(false)

  const isValid = computed(() => booking.value?.title.length > 0)

  async function loadBooking() {
    isLoading.value = true
    booking.value = await BookingManager.fetchBooking(bookingId)
    isLoading.value = false
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

**Constants (`.const.ts`)** — Static configuration values, default values, magic strings/numbers

**Enums (`.enum.ts`)** — TypeScript enums and union types (e.g., `type Status = 'pending' | 'done'`)

### Vue 3 Standards

- Use **Composition API** with `<script setup lang="ts">`
- Prefer `ref` over `reactive` for primitive values
- Use `defineProps` and `defineEmits` with TypeScript generics
- Use `v-model` with `defineModel()` (Vue 3.4+)
- Prefer template refs with `useTemplateRef()` (Vue 3.5+)

### Import Restrictions

In apps and applets, avoid direct imports from libraries. Use scoped package names:

- Use `@pulse/common` instead of `@common`
- Use `@pulse/toolbox` instead of `@toolbox`
- Use `@pulse/styleguide` instead of `@styleguide`

Check the `package.json` of each library to find where and how to import services, managers, etc.

## Unit Testing Requirements

**MANDATORY**: When creating or modifying these file types, you MUST write corresponding unit tests:

| File Type | Test File |
|-----------|-----------|
| `*.composable.ts` | `*.composable.spec.ts` |
| `*.manager.ts` | `*.manager.spec.ts` |
| `*.validation.ts` | `*.validation.spec.ts` |

**Testing guidelines**:

- Use Vitest for all testing
- Do **not** test `.vue` files, only `.ts` files
- Do not `beforeEach(() => { vi.clearAllMocks() })` if it's not absolutely needed
- Do not import vi stuff (`import { describe, it, expect, beforeEach, vi } from 'vitest'`) — already globally available
- Mutualize mocks outside of `describe` blocks when possible, do not repeat mocks unless necessary
- Test all public methods and computed properties
- Test edge cases and error scenarios

**Testing utilities**:

- Use `getStoreMock` from `@pulse/common/mocks/vitest` for Pinia store mocks
- Use `withSetup` from `@pulse/toolbox/utils/test` when testing composables with lifecycle hooks

**Mock patterns**:

- **Use dedicated mock files**: Create mock data factories in `__mocks__/` folders (e.g., `getBookingServiceExpert()`) instead of inline test data
- **Use vitest auto mock pattern** with `vi.mock()` then `vi.mocked()`:

```typescript
// ✅ Good: Auto mock at top level
vi.mock('../../../services')
vi.mock('./my-manager')

// Then in tests, use vi.mocked() to configure behavior
it('should do something', async () => {
  vi.mocked(MyService.myMethod).mockResolvedValueOnce({ data: 'test' })

  // ... test code ...

  expect(vi.mocked(MyService.myMethod)).toHaveBeenCalledWith('expected')
})

// ❌ Bad: Manual mock implementation
vi.mock('../../../services', () => ({
  MyService: {
    myMethod: vi.fn(),
  },
}))
```

## Documentation & Tools

### Vue 3 Documentation (MCP Context7)

**IMPORTANT**: When generating or modifying Vue 3 code, **automatically** use the MCP Context7 tools to fetch the latest Vue 3 documentation (if available):

1. First, resolve the Vue 3 library ID:
   ```
   mcp__context7__resolve-library-id(libraryName: "vue 3", query: "<your specific question>")
   ```

2. Then, query the documentation for the specific feature:
   ```
   mcp__context7__query-docs(libraryId: "<resolved-id>", query: "<specific feature or API>")
   ```

**When to use**: creating new Vue components, using Vue APIs, working with lifecycle hooks, implementing `defineProps`/`defineEmits`/`defineModel`, using template refs/slots, or when unsure about the latest recommended patterns.

**Do NOT ask the user** for permission to fetch documentation. Always proactively consult Context7.

**Fallback**: If Context7 is not available, refer to the official Vue 3 documentation at https://vuejs.org/ or use `web_fetch` to retrieve up-to-date information.

## Environment Setup

### Key Environment Variables

The application uses environment variables loaded via `env-vars.js`. Key variables include: API Gateway URLs and aliases, authentication configuration (MSAL, Gigya), feature flags, third-party service keys (Amplitude, ProductFruits, Axeptio).

See `CONFIG.md` for the complete list of environment variables and their purposes.

## Writing a Plan

When you write a plan, follow these rules:

- Make a detailed plan to accomplish your task
- Think hardest
- How will we implement ONLY the functionality we need right now?
- Identify files that need to be changed
- Do not include plans for legacy fallback unless required or explicitly requested
- Write a short overview of what you are about to do
- Write function names and 1-3 sentences about what they do
- Do NOT write code in the overview
- Don't hesitate to ask questions to the user

## Executing a Plan

When you execute a plan, follow these rules:

- Think hard and write elegant code that completes the plan
- Do not add backwards compatibility unless explicitly requested
- After every code block you write, lint:fix, build and write corresponding tests and run them before writing the next code block
- Do not install or add any new package/dependency without explicitly asking for approval first. Explain why it is needed and what benefits it brings before installing
- Always scope `lint`, `build`, and `test` commands to the workspace(s) you edited — never run them on the entire repository (to prevent long execution times)
  - ✅ `npm run lint --workspace=@pulse/customer`
  - ❌ `npm run lint`
  - ✅ `npm run build --workspace=@pulse/shared`
  - ❌ `npm run build`
  - ✅ `npm run test --workspace=@pulse/common`
  - ❌ `npm run test`
