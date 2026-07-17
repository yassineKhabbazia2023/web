import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'

import { ElContainer } from 'element-plus'
import PContainer from '.'
import type { PContainerProps } from './PContainerTypes'

const propsValue: PContainerProps = {
  pDirection: 'horizontal',
}
const createWrapper = () => mount(PContainer, {
  props: propsValue,
})

describe('pContainer', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const componentVM = wrapper.findComponent(ElContainer).vm
    expect(componentVM.direction).toBe(propsValue.pDirection)
  })
})
