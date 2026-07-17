import type { Mock } from 'vitest'
import type { UnwrapRef } from 'vue'
import type { Store, StoreDefinition } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { getActivePinia, setActivePinia } from 'pinia'

// One testing pinia per test FILE (created eagerly: importing this module must
// keep activating a pinia, some specs rely on that side effect for code calling
// useStore() without getStoreMock). When test files share this module instance
// (isolate: false), the pinia is re-created as soon as the running test file
// changes, so a store is never resolved against the previous file's pinia.
let currentTestingPinia = createTestingPinia()
let currentTestPath = expect.getState().testPath

// Creates (on file change) and activates the testing pinia of the file being
// executed NOW. Called before every test by the project setup AND on every
// store-mock access, so the SUT (resolving the active pinia at call time) and
// the spec assertions always converge on the same store instances — even when
// another file activated its own pinia meanwhile.
export function activateTestingPiniaForCurrentFile(): void {
  if (expect.getState().testPath !== currentTestPath) {
    currentTestPath = expect.getState().testPath
    currentTestingPinia = createTestingPinia()
  } else if (getActivePinia() !== currentTestingPinia) {
    setActivePinia(currentTestingPinia)
  }
}

function resolveCurrentStore(useStore: () => unknown): object {
  activateTestingPiniaForCurrentFile()

  return useStore() as object
}

// see official documentation https://pinia.vuejs.org/cookbook/testing.html#Mocking-the-returned-value-of-an-action
/*
 * example of use:
 * // test.spec.ts
 * import { useCurrentEntityStore } from '@pulse/common/stores'
 *
 * const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
 * currentEntityStoreMock.currentEntity = getMockedEntity()
 */
export function getStoreMock<TStoreDef extends() => unknown>(
  useStore: TStoreDef,
): TStoreDef extends StoreDefinition<
  infer Id,
  infer State,
  infer Getters,
  infer Actions
>
  ? Store<
    Id,
    State,
    Record<string, never>,
    {
      [K in keyof Actions]: Actions[K] extends (...args: any[]) => any
        ? Mock<Actions[K]>
        : Actions[K]
    }
  > & {
    [K in keyof Getters]: UnwrapRef<Getters[K]>
  }
  : ReturnType<TStoreDef> {
  // Lazy handle: every access resolves the store against the pinia of the test
  // file being executed NOW, so a module-scope `const mock = getStoreMock(...)`
  // stays valid even when several files reuse this module instance.
  // Caveat: the proxy target is an empty object, so spreading the mock or
  // passing it to deep matchers (`{ ...mock }`, `toEqual(mock)`) can trip
  // proxy invariants — assert on individual properties instead.
  return new Proxy({}, {
    get: (_target, property) => Reflect.get(resolveCurrentStore(useStore), property),
    set: (_target, property, value) => Reflect.set(resolveCurrentStore(useStore), property, value),
    has: (_target, property) => Reflect.has(resolveCurrentStore(useStore), property),
    ownKeys: () => Reflect.ownKeys(resolveCurrentStore(useStore)),
    getOwnPropertyDescriptor: (_target, property) =>
      Reflect.getOwnPropertyDescriptor(resolveCurrentStore(useStore), property),
  }) as any
}
