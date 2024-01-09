import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PCollapse from '.'
import { ElCollapse } from 'element-plus'

const propsValue = {
  pAccordion: true
}
const createWrapper = () => mount(PCollapse, {
  props: propsValue,
  slots: {
    default: 'test'
  }
})

describe('pCollapse', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const componentVM = wrapper.findComponent(ElCollapse).vm
    expect(componentVM.accordion).toBe(propsValue.pAccordion)
    expect(wrapper.findComponent(ElCollapse).text()).toBe('test')
  })
})
