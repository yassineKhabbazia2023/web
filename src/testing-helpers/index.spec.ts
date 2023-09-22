import { mount } from '@vue/test-utils'
import helpers from './index'
import AppForTest from './AppForTest.vue'
import ComponentForTest from './ComponentForTest.vue'

describe('testing-helpers', () => {

  let wrapper: any

  beforeEach(() => {
    wrapper = mount(AppForTest)
  })

  it('should call vi.dynamicImportSettled to resolves wrapper\'s components', async () => {
    await helpers.waitForAsyncImports(1)
    expect(wrapper.exists()).toBeTruthy()
  })

  it('should works with dynamicUntilFound', async () => {
    const element = await helpers.dynamicUntilFound(wrapper, '.foo')
    expect(element.exists()).toBeTruthy()
  })

  it('should works with dynamicUntilFoundComponent', async () => {
    const element = await helpers.dynamicUntilFoundComponent(wrapper, ComponentForTest)
    expect(element.exists()).toBeTruthy()
  })
})
