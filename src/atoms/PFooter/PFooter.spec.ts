import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { ElFooter } from 'element-plus'
import PFooter from '.'

const propsValue = {
  pHeight: '200px'
}
const createWrapper = () => mount(PFooter, {
  props: propsValue
})

describe('pFooter', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const componentVM = wrapper.findComponent(ElFooter).vm
    expect(componentVM.height).toBe(propsValue.pHeight)
  })
})
