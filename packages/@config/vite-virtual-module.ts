import type { Plugin } from 'vite'

// Replaces vite-plugin-externals for 'env-vars'.
//
// How env-vars works at runtime:
//   1. public/env-vars.js is loaded via <script> tag in index.html (before modules)
//   2. It sets window.EnvVars = { VITE_XXX: "value", ... }
//   3. Source code does: import { VITE_XXX } from 'env-vars'
//
// This plugin handles 'env-vars' differently per mode:
//   - Dev/Build: transforms `import { X } from 'env-vars'` → `const { X } = globalThis.EnvVars`
//   - Test: resolves 'env-vars' as a virtual module so vi.mock('env-vars', ...) works
export const viteVirtualModule = (): Plugin => {
  let isTest = false

  return {
    name: 'env-vars',
    configResolved(config) {
      isTest = config.command === 'serve' && config.mode === 'test'
    },
    resolveId: {
      filter: { id: /^env-vars$/ },
      handler() {
        return '\0env-vars'
      },
    },
    load: {
      filter: { id: /^\0env-vars$/ },
      handler() {
        return 'export default globalThis.EnvVars || {}'
      },
    },
    // Rolldown hook filter: only calls JS for files whose code contains 'env-vars' (Rust-level check)
    transform: {
      filter: {
        id: { exclude: [/node_modules/] },
        code: /from ['"]env-vars['"]/,
      },
      handler(code, id) {
        if (isTest || id.startsWith('\0')) {
          return
        }

        return code.replace(
          /import\s*\{([^}]+)\}\s*from\s*['"]env-vars['"]/g,
          'const {$1} = globalThis.EnvVars || {}',
        )
      },
    },
  }
}
