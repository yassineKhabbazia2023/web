import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { ElHeader } from 'element-plus'
import PCHeader from '.'

const propsValue = {
  pHeight: '60px',
}
const createWrapper = () => mount(PCHeader, {
  props: propsValue,
  slots: {
    default: 'header',
  },
})

describe('pcHeader', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const componentVM = wrapper.findComponent(ElHeader).vm
    expect(componentVM.height).toBe(propsValue.pHeight)
    expect(wrapper.findComponent(ElHeader).text()).toBe('header')
  })
})
