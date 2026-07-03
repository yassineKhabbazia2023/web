## Source Control

- This project is hosted on **Azure DevOps**, NOT GitHub
- **Never use the `gh` CLI** — it is not installed and will always fail
- **Never use GitHub-specific APIs or tools** (gh pr, gh issue, gh api, etc.)
- To inspect branch changes, use only **git commands** (`git log`, `git diff`, `git show`, etc.)
- To identify PR details, rely on the current branch name and git history — do not attempt to query any external PR API
- Commit messages follow conventional commits (`type(scope): description`), prefixed with a gitmoji and `[Tag]` scopes (e.g. `🐛 fix(entities): keep supporting document labels after upload`, `✨ [Payment] Add non-signatory alert`)
- Branch names follow `<type>/<workitem-id>_snake_case_description` with type ∈ `feature`, `fix`, `bug`, `bugfix`, `enabler` (e.g. `feature/61858_agent_props`)
- **Commits and pushes are handled exclusively by the user** — never run `git commit` or `git push` unless the user explicitly asks for it

## Architecture Overview

### Monorepo Structure

This is an npm workspaces monorepo with three main package categories:

1. **Apps** (`packages/apps/`): Vue 3 applications
   - `customer` (`@pulse/customer`): Client-facing app with Gigya authentication, served at `/`
   - `collaborator` (`@pulse/collaborator`): Internal collaborator app with MSAL SSO, served at `/collaborateur/`
   - `backoffice` (`@pulse/backoffice`): Internal admin app — no applet dependencies, only common/toolbox/styleguide
   - `e2e-mocks` (`@pulse/e2e-mocks`): not a Vue app — MSW-based E2E testing/mock infrastructure consumed by the other apps
   - `customer`, `collaborator` and `backoffice` orchestrate routing, authentication flows, and layout components
   - `customer` and `collaborator` integrate applets and libraries; `backoffice` integrates only libraries

2. **Applets** (`packages/applets/`): Feature-specific micro-applications
   - `entities`: Entity management and business logic
   - `booking`: Appointment booking workflows
   - `feed-center`: Notification/feed center
   - `ged`: Document management system (GED) (legacy — ask to clarify intention before starting code if an evolution is needed)
   - `homepage`: Landing/dashboard homepage
   - `launcher`: Application launcher interface
   - `login`: Authentication flows
   - `mandate`: Mandate management workflows (legacy — ask to clarify intention before starting code if an evolution is needed)
   - `offers-catalog`: Product catalog functionality
   - `pennylane`: Pennylane integration
   - `powerbi`: PowerBI reporting integration

3. **Libraries** (`packages/libraries/`): Shared code and components
   - `common`: Core services, API clients, stores, and utilities
   - `shared`: Shared cross-app code (see package for details)
   - `toolbox`: Fundamental utilities, logging, feature flags
   - `styleguide`: Design system components and assets
   - `widgets`: Widget system for configurable dashboards

### Key Technical Patterns

- **State Management**: Pinia stores for global state
- **API Integration**: Centralized through API Gateway with axios interceptors
- **Authentication**: MSAL for collaborator SSO, Gigya for client authentication, token management in authentication service
- **Routing**: Vue Router with guards for authentication, permissions, and feature flags
- **Feature Flags**: declared in the `Feature` enum (`@pulse/common`), checked via `FeatureFlagManager.isXxxActivated()` static accessors (never read env vars directly — some flags are served by OpenFeature/ConfigCat). Routes are gated with the `FEATURE_FLAG_META` route meta
- **Component Architecture**: Atomic design (atoms, molecules, organisms), Composition API with TypeScript, story-driven development with Storybook
- **Build System**: Vite with custom configurations per workspace

## Code Conventions

### Language

- All comments must be written in **English**
- All user-facing output (reviews, explanations, questions, summaries) must match the language of the user's last message — the team works in French, code artifacts stay in English

### Additional Conventions (Skills)

Detailed conventions live in `.agents/skills/*/SKILL.md` and should be consulted even when not auto-triggered:

- `file-conventions`: file naming, folder structure, type naming, SFC structure
- `testing`: unit testing requirements and patterns
- `npm-install`: mandatory pre-flight checks before adding any dependency
- `review-pr`: PR review process (conventions + functional logic/flows)
- `run-app`: how to run the apps, Storybook, tests and lint locally

### Coding Standards

- Unless explicitly stated, we don't care about retrocompatibility. This project is self-sufficient
- Use explicit, descriptive variable names (can be long if needed)
- Prioritize Styleguide CSS classes (based on element-plus)
- Never write CSS classes for basic styles (flex, margin, etc.) unless they don't exist in the StyleGuide
- ESLint configuration enforces formatting rules (2-space indentation, no semicolons, single quotes)
- No falsy values: always use `test === false` instead of `!test`, with no exception (e.g. `isLoading === false`, never `!isLoading`)
- No truthy values: use `test === true` instead of a bare `test`. The only exception is the truthy check of `isXXX`/`hasXXX`/`shouldXXX` variables, which can be used bare (e.g. `if (isLoading)`, not `if (isLoading === true)`)
- For nullish checks, use `value === null || value === undefined` instead of `!value`, use utils like `isNullOrEmpty` when appropriate
- **Always use `String#replaceAll()` instead of `String#replace()`** with global regex flags. For literal replacements, use `replaceAll('x', 'y')` instead of `replace(/x/g, 'y')`. This avoids regex backtracking vulnerabilities and improves readability
- **Never prefix a function call with `void`** (e.g. write `doSomething()`, not `void doSomething()`)
- **Never use `console.*`** — log through `logger` from `@pulse/toolbox`

### CSS Class Formatting

When using more than 2 CSS classes, use multi-line format:

```vue
<!-- Good: More than 2 classes, use multi-line -->
<div
  class="
    first-class
    second-class
    third-class
  "
/>

<!-- Good: 1-2 classes, inline is fine -->
<div class="first-class second-class" />

<!-- Bad: More than 2 classes on single line -->
<div class="first-class second-class third-class" />
```

### Vue 3 Standards

- Use **Composition API** with `<script setup lang="ts">`
- Prefer `ref` over `reactive` for primitive values
- Use `defineProps` and `defineEmits` with TypeScript generics
- Use `defineModel()` (Vue 3.4+) for two-way bindings — never use the manual `:modelValue` + `@update:model-value` + `defineEmits` pattern
- Prefer template refs with `useTemplateRef()` (Vue 3.5+)
- **Prefer `@change` (or other template events) over `watch`** when a reactive value only changes from a single source (e.g. a checkbox, an input). Use `watch` only when the value can be modified from multiple sources. A template event is more explicit and avoids unnecessary watchers.
- **Use `@pulse/toolbox` utility helpers** instead of reinventing common checks. For example, use `isNotNullNorEmpty` from `@pulse/toolbox/utils/validator` instead of writing manual `value !== null && value !== undefined && value !== ''` checks. Always check what helpers already exist in toolbox before writing your own.
- **Destructure composables when consuming them** instead of keeping the returned object. Top-level refs are auto-unwrapped in templates, so destructuring avoids `.value` in templates (e.g. `const { isLoading, booking } = useBookingForm()`, then `{{ isLoading }}` in the template — never `const form = useBookingForm()` then `form.isLoading.value`).
- **Never reference `props.xxx` in templates.** It's unnecessary in Vue 3: `defineProps` return values are already available directly in the template (e.g. `{{ bookingId }}`, not `{{ props.bookingId }}`). This only applies to templates — using `const props = defineProps<...>()` and `props.xxx` in the script is fine and does not need to be destructured.
- **Never prefix props with a leading `p` (e.g. `pDisabled`, `pType`).** That `p` prefix is a `@pulse/styleguide` component convention only (see `PSkewedButtonProps` etc. in `packages/libraries/styleguide`). Components in apps, applets, and other libraries must use plain, unprefixed prop names (e.g. `disabled`, `type`).
- **UI components always come from `@pulse/styleguide`** (e.g. `import { PButton } from '@pulse/styleguide/components'`). Never render `el-*` tags directly — element-plus is an implementation detail of the styleguide (importing its types is fine). For user notifications, use `PNotification` / `displayNotification` from `@pulse/styleguide`.

### i18n

- Never hardcode user-facing strings — every label goes through vue-i18n
- Each applet owns its locale files in `src/i18n/fr-FR.json` and `src/i18n/en-US.json` — always add keys to **both**
- Keys are namespaced under the applet name in camelCase (e.g. `feedCenter.settingsDrawer.success`, `entities.wallet.subscriptionStatusFilters.toCreate`)
- In components and composables, use `const { t } = useI18n()` (from `vue-i18n`); outside a component context (managers), use `i18n.global.t(...)` with `i18n` from `@pulse/common/i18n`

### Import Restrictions

In apps and applets, avoid direct imports from libraries. Use scoped package names:

- Use `@pulse/common` instead of `@common`
- Use `@pulse/toolbox` instead of `@toolbox`
- Use `@pulse/styleguide` instead of `@styleguide`

Check the `package.json` of each library to find where and how to import services, managers, etc.

**Avoid deep relative imports within a package.** When an intra-package import would need 3 or more `../` segments (`../../../` or deeper), use the package's local alias instead. Each workspace exposes a `@<package>/*` alias mapped to its `src/` (e.g. `@entities/*`, `@mandate/*`, `@customer/*` — see `packages/@config/tsconfig.paths.json`). Up to 2 levels (`../` or `../../`) relative paths are fine.

```ts
// Bad: deep relative path
import { useDocumentsConsultDrawerStore } from '../../../../documents/documents-consult-drawer/documents-consult-drawer.store'

// Good: local alias from the package root
import { useDocumentsConsultDrawerStore } from '@entities/modules/entity/prospect/documents/documents-consult-drawer/documents-consult-drawer.store'
```

These local aliases are **only** for imports within the same package. For cross-package imports, still use the scoped package name (`@pulse/common`, etc.) as above — never `@common`/`@toolbox`/`@styleguide`.

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

**Fallback**: If Context7 is not available, refer to the official Vue 3 documentation at https://vuejs.org/ or use the `WebFetch` tool to retrieve up-to-date information.

## Environment Setup

### Key Environment Variables

Environment variables are configured per app/environment (not in a single root file). Key variables include: API Gateway URLs and aliases, authentication configuration (MSAL, Gigya), feature flags, third-party service keys (Amplitude, ProductFruits, Axeptio).

See `CONFIG.md` for the complete list of environment variables and their purposes.

## Ways of Working

### Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
  - Exception: the Coding Standards (falsy/truthy checks, `replaceAll`, `import type`, etc.) apply to every line you write or modify, even inside a legacy file that doesn't follow them. Do not rewrite untouched lines to conform.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

### Writing a Plan

When you write a plan, follow these rules:

- Make a detailed plan to accomplish your task
- Think hardest
- Identify files that need to be changed
- Write a short overview of what you are about to do
- Write function names and 1-3 sentences about what they do
- Do NOT write code in the overview

### Executing a Plan

When you execute a plan, follow these rules:

- Think hard and write elegant code that completes the plan
- After every code block you write, lint:fix and build before writing the next code block
- Write and run corresponding unit tests as mandated by the `testing` skill before moving on
- Do not install or add any new package/dependency without explicitly asking for approval first. Explain why it is needed and what benefits it brings before installing
- Always scope `lint`, `build`, and `test` commands to the workspace(s) you edited — never run them on the entire repository (to prevent long execution times)
  - `npm run lint --workspace=@pulse/customer`
  - `npm run build --workspace=@pulse/shared`
  - `npm run test --workspace=@pulse/common`
