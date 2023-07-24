import { type ComponentMountingOptions, shallowMount, VueWrapper } from '@vue/test-utils'
import { type ComponentOptionsMixin } from 'vue'

const wrapperFactory = (
  vueComponent: ComponentOptionsMixin,
  options?: ComponentMountingOptions<any>
): VueWrapper<any> => shallowMount(vueComponent, options)

export default wrapperFactory
