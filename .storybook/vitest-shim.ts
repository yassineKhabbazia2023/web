// Shim for vitest in Storybook context
// This allows importing mocks that use vitest types/functions

const viShim = {
  fn: () => Object.assign(() => {}, {
    mockReturnValue: () => {},
    mockResolvedValue: () => {},
    mockImplementation: () => {},
  }),
  mock: () => {},
  spyOn: () => ({ mockImplementation: () => {} }),
}

export { viShim as vi }
export type Mock = (...args: unknown[]) => unknown

// Expose vi globally for mocks that use it without importing
;(globalThis as Record<string, unknown>).vi = viShim
