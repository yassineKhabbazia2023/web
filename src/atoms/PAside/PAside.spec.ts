import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PAside from '.'
import { ElAside } from 'element-plus'

const propsValue = {
  pWidth: '200px'
}
const createWrapper = () => mount(PAside, {
  props: propsValue
})

describe('pAside', () => {
  it('render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const componentVM = wrapper.findComponent(ElAside).vm
    expect(componentVM.width).toBe(propsValue.pWidth)
  })
})
