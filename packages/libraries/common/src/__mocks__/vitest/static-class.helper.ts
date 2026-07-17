// Generic no-op stub for static-class methods (doctrine: static-classes): spies the real
// class so a consumer under test installs without leaking behavior into the
// worker-shared statics. The spies are restored to the real methods before
// every test by the global mock hygiene.
//
// Callers lazy-import the class themselves and pass it in — this helper imports
// no application code, so it stays safe to reach from the mocks barrel that
// vi.mock factories load (doctrine: mock-barrel).
export function stubStaticMethods<T extends object>(staticClass: T, methodNames: (keyof T)[]): void {
  for (const methodName of methodNames) {
    vi.spyOn(staticClass, methodName as never).mockImplementation((() => undefined) as never)
  }
}
