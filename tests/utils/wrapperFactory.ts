import { type MountingOptions, shallowMount, VueWrapper } from '@vue/test-utils'
import { type ComponentOptionsMixin } from 'vue'

const wrapperFactory = (
  vueComponent: ComponentOptionsMixin,
  options?: MountingOptions<any>
// eslint-disable-next-line
//@ts-ignore
): VueWrapper<any> => shallowMount(vueComponent, options)

export default wrapperFactory
