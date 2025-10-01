import type { Plugin } from 'vite'

// An issue occurs on vitest for 'env-vars'
// https://github.com/vitest-dev/vitest/issues/993
export const viteVirtualModule = (): Plugin => ({
  name: 'virtualModule',
  resolveId(id) {
    if (id === 'env-vars') {
      return id
    }
  },
  load(id) {
    if (id === 'env-vars') {
      return ''
    }
  },
})
