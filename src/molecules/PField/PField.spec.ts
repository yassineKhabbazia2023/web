import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import PBankCard from '.'
import type { PFieldProps } from './PFieldTypes'
import { getMockedInputField, getDropdownField, getDateField } from './PFieldMock'
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
  describe('with date field', () => {
    const props = getDateField(
      pFieldKey,
      pLabel,
      pPlaceholder,
      50
    )
    let pDatePicker: VueWrapper
    beforeEach(() => {
      wrapper = createWrapper<string>(props)
      pDatePicker = wrapper.findComponent({ name: 'PDatePicker' })
    })
    it('should render PDatePicker', () => {
      expect.hasAssertions()

      expect(pDatePicker.exists()).toBeTruthy()
    })
    it('should emit update:modelValue when enter value', () => {
      expect.hasAssertions()
      const otherDateIso = '2024-01-30'
      const otherDate = new Date(otherDateIso)

      pDatePicker.vm.$emit('update:modelValue', otherDate)

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[otherDateIso]])
    })
  })
})
