import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'

import { ElPopper } from 'element-plus'
import PPopper from '.'
import type { PPopperProps } from './PPopperTypes'

const propsValue: PPopperProps = {
  pRole: 'tooltip',
}
const createWrapper = () => shallowMount(PPopper, {
  props: propsValue,
})

describe('pPopper', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const componentVM = wrapper.findComponent(ElPopper).vm
    expect(componentVM.role).toBe(propsValue.pRole)
  })
})
