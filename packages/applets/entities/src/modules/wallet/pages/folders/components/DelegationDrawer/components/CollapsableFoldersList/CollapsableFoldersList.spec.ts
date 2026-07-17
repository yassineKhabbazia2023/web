import { mount, type VueWrapper } from '@vue/test-utils'
import { PCollapse } from '@pulse/styleguide/components'
import CollapsableFoldersList from '.'

const createWrapper = (): VueWrapper => {
  return mount(CollapsableFoldersList)
}

let wrapper: VueWrapper

describe('collapsable folders list', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('props', () => {
    it('should render', () => {
      const collapseWrapper = wrapper.findComponent(PCollapse)

      expect(collapseWrapper.exists()).toBeTruthy()
    })
  })
})
