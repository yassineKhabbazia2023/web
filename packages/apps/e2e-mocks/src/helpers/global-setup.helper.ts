/**
 * Creates a Playwright globalSetup function that pre-warms Vite's in-memory cache.
 * This avoids parallel workers hitting an un-compiled Vite server simultaneously.
 */
export function createGlobalSetup(baseURL: string, routes: string[] = []) {
  return async function globalSetup() {
    await fetch(baseURL)
    for (const route of routes) {
      await fetch(new URL(route, baseURL).href)
    }
  }
}
