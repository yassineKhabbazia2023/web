import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import { ElRadio } from 'element-plus'
import PRadio from '.'
import type { PRadioProps, PRadioValue } from './PRadioTypes'

const propsValue: PRadioProps = {
  pLabel: 'label',
  pDisabled: false,
  pBorder: false,
  pSize: 'small',
  pName: 'name',
}
const createWrapper = (modelValue?: PRadioValue) => shallowMount(PRadio, {
  props: {
    ...propsValue,
    modelValue,
  },
})

describe('pRadio', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper(propsValue.pLabel)
    const componentVM = wrapper.findComponent(ElRadio).vm

    expect(componentVM.modelValue).toBe(propsValue.pLabel)
    expect(componentVM.label).toBe(propsValue.pLabel)
    expect(componentVM.value).toBe(propsValue.pLabel)
    expect(componentVM.disabled).toBe(propsValue.pDisabled)
    expect(componentVM.border).toBe(propsValue.pBorder)
    expect(componentVM.size).toBe(propsValue.pSize)
    expect(componentVM.name).toBe(propsValue.pName)
  })

  it('should emit update:modelValue when radio updates', async () => {
    const wrapper = createWrapper()
    const radio = wrapper.findComponent(ElRadio)

    radio.vm.$emit('update:modelValue', 'next-value')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toStrictEqual([['next-value']])
  })
})
