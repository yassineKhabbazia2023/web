import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { ElHeader } from 'element-plus'
import PCHeader from '.'

const propsValue = {
  pHeight: '60px'
}
const createWrapper = () => mount(PCHeader, {
  props: propsValue
})

describe('pcHeader', () => {
  it('should render correctly', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const componentVM = wrapper.findComponent(ElHeader).vm
    expect(componentVM.height).toBe(propsValue.pHeight)
  })
})
