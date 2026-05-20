import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PCheckbox from '.'
import type { PCheckboxProps } from './PCheckboxTypes'

const props: PCheckboxProps = {
  pRounded: true,
}
const createWrapper = (propsOverride: Partial<PCheckboxProps & { modelValue: boolean }> = {}) => shallowMount(PCheckbox, {
  props: {
    ...props,
    ...propsOverride,
  },
})

describe('pCheckbox', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    expect(wrapper.find('.p-checkbox--rounded')).toBeTruthy()
  })

  it('should pass false to ElCheckbox modelValue by default', () => {
    const wrapper: VueWrapper<any> = createWrapper()

    expect(wrapper.findComponent({ name: 'ElCheckbox' }).props('modelValue')).toBe(false)
  })

  it('should pass modelValue to ElCheckbox modelValue', () => {
    const wrapper: VueWrapper<any> = createWrapper({ modelValue: true })

    expect(wrapper.findComponent({ name: 'ElCheckbox' }).props('modelValue')).toBe(true)
  })

  it('should emit update:modelValue when ElCheckbox updates', async () => {
    const wrapper: VueWrapper<any> = createWrapper()

    await wrapper.findComponent({ name: 'ElCheckbox' }).vm.$emit('update:modelValue', true)

    expect(wrapper.emitted('update:modelValue')).toStrictEqual([[true]])
  })

  it('should not emit update:modelValue when ElCheckbox emits a non boolean value', async () => {
    const wrapper: VueWrapper<any> = createWrapper()

    await wrapper.findComponent({ name: 'ElCheckbox' }).vm.$emit('update:modelValue', 'true')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
