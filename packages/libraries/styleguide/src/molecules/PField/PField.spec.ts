import { nextTick } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import type { PFieldProps } from './PFieldTypes'
import { getMockedInputField, getDropdownField, getDateField, getRadioField, getMockedEmailInputField, getMockedCheckbox } from './PField.mocks'
import type { PDropdownOption } from '../PDropdown/PDropdownTypes'
import PField from '.'

function createWrapper<T>(props: PFieldProps<T>) {
  return shallowMount(PField, {
    props: props as any,
    global: {
      stubs: {
        PDatePicker: {
          name: 'PDatePicker',
          template: '<div><slot /></div>',
        },
        PDropdown: {
          name: 'PDropdown',
          template: '<div><slot /></div>',
        },
        PFormItem: {
          name: 'PFormItem',
          template: '<div><slot /></div>',
          props: ['pLabel'],
        },
        PInput: {
          name: 'PInput',
          template: '<div><slot /></div>',
        },
        PRadio: {
          name: 'PRadio',
          template: '<div><slot /></div>',
        },
        PCheckbox: {
          name: 'PCheckbox',
          template: '<div><slot /></div>',
          props: ['modelValue'],
        },
        PEmailInputField: {
          name: 'PEmailInputField',
          template: '<div><slot /></div>',
        },
      },
    },
  })
}

function getPCheckboxModelValue(component: VueWrapper) {
  return (component.props() as { modelValue: boolean }).modelValue
}

const pFieldKey = 'firstname'
const pLabel = 'First name'
const pPlaceholder = 'John'
const ruleTypes: string[] = []
const pDropdownOptions: PDropdownOption[] = [{
  pValue: 'b',
  pLabel: 'B',
}]

describe('test PField', () => {
  let wrapper: VueWrapper

  describe('with input field', () => {
    const props = getMockedInputField(
      pFieldKey,
      pLabel,
      pPlaceholder,
      50,
      false,
      ruleTypes,
    )
    let pInput: VueWrapper
    beforeEach(() => {
      wrapper = createWrapper<string>(props)
      pInput = wrapper.findComponent({ name: 'PInput' })
    })
    it('should render PInput', () => {
      expect(pInput.exists()).toBeTruthy()
    })
    it('should emit update:model-value when enter value', () => {
      const otherValue = 'Henry'

      pInput.vm.$emit('update:model-value', otherValue)

      expect(wrapper.emitted('update:model-value')).toStrictEqual([[otherValue]])
    })
  })
  describe('with email input field', () => {
    const props = getMockedEmailInputField(
      pFieldKey,
      'test.com',
      'Local Part Placeholder',
      'Domain Part Placeholder',
      false,
      false,
      50,
      ruleTypes,
    )
    let pEmailInputField: VueWrapper
    beforeEach(() => {
      wrapper = createWrapper<string>(props)
      pEmailInputField = wrapper.findComponent({ name: 'PEmailInputField' })
    })
    it('should render PEmailInputField', () => {
      expect(pEmailInputField.exists()).toBeTruthy()
    })
    it('should emit update:model-value when enter value', () => {
      const otherValue = 'test@test.com'

      pEmailInputField.vm.$emit('update:model-value', otherValue)

      expect(wrapper.emitted('update:model-value')).toStrictEqual([[otherValue]])
    })
  })
  describe('with dropdrop field', () => {
    const props = getDropdownField(
      pFieldKey,
      pLabel,
      50,
      pDropdownOptions,
    )
    let pDropDown: VueWrapper
    beforeEach(() => {
      wrapper = createWrapper<number | undefined>(props)
      pDropDown = wrapper.findComponent({ name: 'PDropdown' })
    })
    it('should render PDropdown', () => {
      expect(pDropDown.exists()).toBeTruthy()
    })
    it('should emit update:model-value when enter value', () => {
      const otherValue = 'b'

      pDropDown.vm.$emit('update:model-value', otherValue)

      expect(wrapper.emitted('update:model-value')).toStrictEqual([[otherValue]])
    })
  })
  describe('with dropdrop field multiple', () => {
    const baseProps = getDropdownField(
      pFieldKey,
      pLabel,
      50,
      pDropdownOptions,
      false,
      true,
    )
    const props: PFieldProps<number[]> = {
      ...baseProps,
      modelValue: [] as number[],
    }
    let pDropDown: VueWrapper
    beforeEach(() => {
      wrapper = createWrapper<number[]>(props)
      pDropDown = wrapper.findComponent({ name: 'PDropdown' })
    })
    it('should render PDropdown', () => {
      expect(pDropDown.exists()).toBeTruthy()
    })
    it('should emit update:model-value when enter value', () => {
      const otherValue = ['b']

      pDropDown.vm.$emit('update:model-value', otherValue)
      expect(wrapper.emitted('update:model-value')).toStrictEqual([[otherValue]])
    })
  })
  describe('with date field', () => {
    const props = getDateField(
      pFieldKey,
      pLabel,
      pPlaceholder,
      50,
    )
    let pDatePicker: VueWrapper
    beforeEach(() => {
      wrapper = createWrapper<string>(props)
      pDatePicker = wrapper.findComponent({ name: 'PDatePicker' })
    })
    it('should render PDatePicker', () => {
      expect(pDatePicker.exists()).toBeTruthy()
    })
    it('should emit update:model-value when enter value', () => {
      const otherDateIso = '2024-01-30'
      const otherDate = new Date(otherDateIso)

      pDatePicker.vm.$emit('update:model-value', otherDate)

      expect(wrapper.emitted('update:model-value')).toStrictEqual([[otherDateIso]])
    })
  })
  describe('with checkbox field', () => {
    const props = getMockedCheckbox(pFieldKey, pLabel, false, false, 50)
    let pCheckbox: VueWrapper
    beforeEach(() => {
      wrapper = createWrapper<boolean>(props)
      pCheckbox = wrapper.findComponent({ name: 'PCheckbox' })
    })
    it('should render PCheckbox', () => {
      expect(pCheckbox.exists()).toBeTruthy()
    })
    it('should use modelValue as checkbox value', () => {
      wrapper = createWrapper<boolean>({
        ...props,
        modelValue: true,
        pChecked: false,
      })
      pCheckbox = wrapper.findComponent({ name: 'PCheckbox' })

      expect(getPCheckboxModelValue(pCheckbox)).toBe(true)
    })
    it('should fallback to pChecked when modelValue is not a boolean', () => {
      wrapper = createWrapper<boolean>({
        ...props,
        modelValue: undefined,
        pChecked: true,
      })
      pCheckbox = wrapper.findComponent({ name: 'PCheckbox' })

      expect(getPCheckboxModelValue(pCheckbox)).toBe(true)
    })
    it('should keep false modelValue over pChecked fallback', () => {
      wrapper = createWrapper<boolean>({
        ...props,
        modelValue: false,
        pChecked: true,
      })
      pCheckbox = wrapper.findComponent({ name: 'PCheckbox' })

      expect(getPCheckboxModelValue(pCheckbox)).toBe(false)
    })
    it('should not show the label', () => {
      const pFormItem = wrapper.findComponent({ name: 'PFormItem' })

      expect(pFormItem.props('pLabel')).toBe('')
    })
    it('should emit update:model-value when enter value', () => {
      const otherValue = true

      pCheckbox.vm.$emit('update:model-value', otherValue)

      expect(wrapper.emitted('update:model-value')).toStrictEqual([[otherValue]])
    })
  })
  describe('with radio field', () => {
    const props = getRadioField({
      pFieldKey,
      pLabel,
      pPlaceholder,
    })
    let pRadio: VueWrapper
    beforeEach(() => {
      wrapper = createWrapper<string | string[]>(props)
      pRadio = wrapper.findComponent({ name: 'PRadio' })
    })
    it('should render PRadio', () => {
      expect(pRadio.exists()).toBeTruthy()
    })
    it('should emit update:model-value when enter value', () => {
      const otherValue = 'b'

      pRadio.vm.$emit('update:model-value', otherValue)

      expect(wrapper.emitted('update:model-value')).toStrictEqual([[otherValue]])
    })
  })
  describe('with radio field multiple', () => {
    const props = getRadioField({
      modelValue: ['a'],
      pFieldKey,
      pLabel,
      pPlaceholder,
      pMultiple: true,
    })
    const value0 = props.pOptions?.at(0)?.pValue
    const value1 = props.pOptions?.at(1)?.pValue
    let pCheckboxes: VueWrapper[]
    beforeEach(() => {
      wrapper = createWrapper<string | string[]>(props)
      pCheckboxes = wrapper.findAllComponents({ name: 'PCheckbox' })
    })

    it('should render PRadio', () => {
      expect(pCheckboxes).toHaveLength(props.pOptions?.length ?? 0)
    })

    const tests1 = [{
      optionIndex: 0,
      isChecked: false,
      reason: 'deselects a selected option',
      expected: [],
    }, {
      optionIndex: 1,
      isChecked: true,
      reason: 'selects a new option',
      expected: [value0, value1],
    }]
    it.each(tests1)('should emit update:model-value when $reason', async ({
      optionIndex,
      isChecked,
      expected,
    }) => {
      await nextTick()
      expect(wrapper.emitted('update:model-value')).toBeUndefined()

      pCheckboxes[optionIndex].vm.$emit('update:model-value', isChecked)
      await nextTick()

      expect(wrapper.emitted('update:model-value')).toStrictEqual([[expected]])
    })

    const tests2 = [{
      optionIndex: 0,
      isChecked: true,
      reason: 'selects an already selected option',
    }, {
      optionIndex: 1,
      isChecked: false,
      reason: 'deselects an already deselected option',
    }]
    it.each(tests2)('should NOT emit update:model-value when $reason', async ({
      optionIndex,
      isChecked,
    }) => {
      pCheckboxes[optionIndex].vm.$emit('update:model-value', isChecked)
      await nextTick()

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
    })
  })
})
