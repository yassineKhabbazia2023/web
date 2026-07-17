import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'

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

  it('should not apply the label-left modifier by default', () => {
    const wrapper: VueWrapper<any> = createWrapper()

    expect(wrapper.findComponent({ name: 'ElCheckbox' }).classes()).not.toContain('p-checkbox--label-left')
  })

  it('should apply the label-left modifier when pLabelLeft is true', () => {
    const wrapper: VueWrapper<any> = createWrapper({ pLabelLeft: true })

    expect(wrapper.findComponent({ name: 'ElCheckbox' }).classes()).toContain('p-checkbox--label-left')
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

  it('should pass undefined to ElCheckbox disabled by default', () => {
    const wrapper: VueWrapper<any> = createWrapper()

    expect(wrapper.findComponent({ name: 'ElCheckbox' }).props('disabled')).toBeUndefined()
  })

  it('should pass pDisabled to ElCheckbox disabled', () => {
    const wrapper: VueWrapper<any> = createWrapper({ pDisabled: true })

    expect(wrapper.findComponent({ name: 'ElCheckbox' }).props('disabled')).toBe(true)
  })
})
