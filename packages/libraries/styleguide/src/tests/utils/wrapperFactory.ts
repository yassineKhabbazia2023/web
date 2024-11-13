import { shallowMount } from '@vue/test-utils'
import type { VueWrapper, ComponentMountingOptions } from '@vue/test-utils'

import { type ComponentOptionsMixin } from 'vue'

const wrapperFactory = (
  vueComponent: ComponentOptionsMixin,
  options?: ComponentMountingOptions<any>,
): VueWrapper<any> => shallowMount(vueComponent, options)

export default wrapperFactory
