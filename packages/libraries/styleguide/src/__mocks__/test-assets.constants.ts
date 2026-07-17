// Canonical assets base URL the worker's specs rely on: set once in
// vitest.setup.ts and restored by any spec that mutates the shared
// imageResolverInit state (doctrine: shared-dom).
export const TEST_ASSETS_BASE_URL = 'https://www.example.kpmg'
