## Source Control

- This project is hosted on **Azure DevOps**, NOT GitHub
- **Never use the `gh` CLI** — it is not installed and will always fail
- **Never use GitHub-specific APIs or tools** (gh pr, gh issue, gh api, etc.)
- To inspect branch changes, use only **git commands** (`git log`, `git diff`, `git show`, etc.)
- To identify PR details, rely on the current branch name and git history — do not attempt to query any external PR API

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
- **Component Architecture**: Atomic design (atoms, molecules, organisms), Composition API with TypeScript, story-driven development with Storybook
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
- No falsy values: always use `test === false` instead of `!test`, with no exception (e.g. `isLoading === false`, never `!isLoading`)
- No truthy values: use `test === true` instead of a bare `test`. The only exception is the truthy check of `isXXX`/`hasXXX`/`shouldXXX` variables, which can be used bare (e.g. `if (isLoading)`, not `if (isLoading === true)`)
- For nullish checks, use `value === null || value === undefined` instead of `!value`, use utils like `isNullOrEmpty` when appropriate
- **Always use `String#replaceAll()` instead of `String#replace()`** with global regex flags. For literal replacements, use `replaceAll('x', 'y')` instead of `replace(/x/g, 'y')`. This avoids regex backtracking vulnerabilities and improves readability

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

### Import Restrictions

In apps and applets, avoid direct imports from libraries. Use scoped package names:

- Use `@pulse/common` instead of `@common`
- Use `@pulse/toolbox` instead of `@toolbox`
- Use `@pulse/styleguide` instead of `@styleguide`

Check the `package.json` of each library to find where and how to import services, managers, etc.

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
  - `npm run lint --workspace=@pulse/customer`
  - `npm run build --workspace=@pulse/shared`
  - `npm run test --workspace=@pulse/common`
