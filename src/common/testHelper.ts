import { type ComponentMountingOptions, mount, VueWrapper } from '@vue/test-utils'
import { type ComponentOptionsMixin } from 'vue'
import { waitForAsyncImports } from '@kpmg/common/src/testing-helpers'

export async function wrapperFactory(
  vueComponent: ComponentOptionsMixin,
  options?: ComponentMountingOptions<any>
) {
  const wrapper: VueWrapper<any> = mount(vueComponent, options)

  await waitForAsyncImports(50)

  return wrapper
}
