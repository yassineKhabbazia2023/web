import { VueWrapper, flushPromises } from '@vue/test-utils'
import { FindComponentSelector } from '@vue/test-utils/dist/types'
import { vi } from 'vitest'
import { nextTick } from 'vue'

/**
 * Wait for async components to be resolved in your wrappers.
 *
 * @remarks
 * This method is part of the vi.dynamicImportSettled() resolution.
 * https://github.com/vitest-dev/vitest/issues/1328
 *
 * @param loopCount - how many times i.dynamicImportSettled() have to be invoked
 */
export const waitForAsyncImports = async (loopCount: number) => {
  await flushPromises()
  for (let i = 0; i < loopCount; i++) {
    await vi.dynamicImportSettled()
  }
  await nextTick()
}

/**
 * Invoke waitForAsyncImports until your string selector
 * returns an non empty wrapper's element by method wrapper.find
 *
 * @param wrapper - your wrapper in you test file
 * @param selector - a string selector
 */
export const dynamicUntilFound =
  async (wrapper: VueWrapper<any>, selector: string) => {
    return await loopUntilElementFounded(() => wrapper.find(selector))
  }

/**
 * Invoke waitForAsyncImports until your component's selector
 * returns an non empty wrapper's element by method wrapper.findComponent
 *
 * @param wrapper - your wrapper in you test file
 * @param selector - a Vue Component
 */
export async function
dynamicUntilFoundComponent<T extends FindComponentSelector>(
  wrapper: VueWrapper<any>, selector: string | T
) {
  return await loopUntilElementFounded(() => wrapper.findComponent(selector))
}

async function loopUntilElementFounded(findOrFindComponent: Function) {
  const maxLoops = 1000
  let loop = 0
  let element = findOrFindComponent()
  while (!element.exists() && loop <= maxLoops) {
    await waitForAsyncImports(1)
    element = findOrFindComponent()
    loop++
  }
  return element
}

export default {
  waitForAsyncImports,
  dynamicUntilFound,
  dynamicUntilFoundComponent
}
