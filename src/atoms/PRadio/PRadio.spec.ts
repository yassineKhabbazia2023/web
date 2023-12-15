import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { ElRadio } from 'element-plus'
import PRadio from '.'
import type { PRadioProps } from './PRadioTypes'

const propsValue: PRadioProps = {
  pLabel: 'label',
  pDisabled: false,
  pBorder: false,
  pSize: 'small',
  pName: 'name'
}
const createWrapper = () => mount(PRadio, {
  props: propsValue
})

describe('pRadio', () => {
  it('should render correctly', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const componentVM = wrapper.findComponent(ElRadio).vm
    expect(componentVM.label).toBe(propsValue.pLabel)
    expect(componentVM.disabled).toBe(propsValue.pDisabled)
    expect(componentVM.border).toBe(propsValue.pBorder)
    expect(componentVM.size).toBe(propsValue.pSize)
    expect(componentVM.name).toBe(propsValue.pName)
  })
})
