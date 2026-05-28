import type { Mock } from 'vitest'
import type { UnwrapRef } from 'vue'
import type { Store, StoreDefinition } from 'pinia'
import { createTestingPinia } from '@pinia/testing'

createTestingPinia()

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
  return useStore() as any
}
