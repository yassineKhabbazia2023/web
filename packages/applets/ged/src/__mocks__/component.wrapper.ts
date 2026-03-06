import type { VueWrapper } from '@vue/test-utils'

export function findComponentByNameInWrapper(wrapper: VueWrapper, componentName: string) {
  return wrapper.findComponent({ name: componentName })
}
