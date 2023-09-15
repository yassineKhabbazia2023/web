import { type ComponentMountingOptions, mount, VueWrapper } from '@vue/test-utils'
import { type ComponentOptionsMixin } from 'vue'

const wrapperFactory = (
  vueComponent: ComponentOptionsMixin,
  options?: ComponentMountingOptions<any>
): VueWrapper<any> => mount(vueComponent, options)

export default wrapperFactory
