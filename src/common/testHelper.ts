import { type ComponentMountingOptions, mount, VueWrapper } from '@vue/test-utils'
import { type ComponentOptionsMixin } from 'vue'

export async function wrapperFactory(
  vueComponent: ComponentOptionsMixin,
  options?: ComponentMountingOptions<any>
) {
  const wrapper: VueWrapper<any> = mount(vueComponent, options)

  return wrapper
}
