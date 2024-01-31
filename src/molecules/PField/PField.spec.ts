import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import PBankCard from '.'
import type { PFieldProps } from './PFieldTypes'
import { getMockedInputField, getDropdownField } from './PFieldMock'
import type { PDropdownOption } from '../PDropdown/PDropdownTypes'

function createWrapper<T>(props: PFieldProps<T>) {
  return mount(PBankCard, {
    props
  })
}

const pFieldKey = 'firstname'
const pLabel = 'First name'
const pPlaceholder = 'John'
const ruleTypes: string[] = []
const pDropdownOptions: PDropdownOption[] = []

describe('test PField', () => {
  let wrapper: VueWrapper

  describe('with input field', () => {
    const props = getMockedInputField(
      pFieldKey,
      pLabel,
      pPlaceholder,
      50,
      false,
      ruleTypes
    )
    let pInput: VueWrapper
    beforeEach(() => {
      wrapper = createWrapper<string>(props)
      pInput = wrapper.findComponent({ name: 'PInput' })
    })
    it('should render PInput', () => {
      expect(pInput.exists()).toBeTruthy()
    })
    it('should emit update:modelValue when enter value', () => {
      const otherValue = 'Henry'

      pInput.vm.$emit('update:modelValue', otherValue)

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[otherValue]])
    })
  })
  describe('with dropdrop field', () => {
    const props = getDropdownField(
      pFieldKey,
      pLabel,
      50,
      pDropdownOptions
    )
    let pDropDown: VueWrapper
    beforeEach(() => {
      wrapper = createWrapper<number | undefined>(props)
      pDropDown = wrapper.findComponent({ name: 'PDropdown' })
    })
    it('should render PDropdown', () => {
      expect(pDropDown.exists()).toBeTruthy()
    })
    it('should emit update:modelValue when enter value', () => {
      const otherValue = 'b'

      pDropDown.vm.$emit('update:modelValue', otherValue)

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[otherValue]])
    })
  })
})
