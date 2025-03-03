import type { VueWrapper } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'

export type ComponentWrapper<T> = VueWrapper<ComponentPublicInstance & T>

export function findComponentByNameInWrapper(wrapper: VueWrapper, componentName: string) {
  return wrapper.findComponent({ name: componentName })
}
