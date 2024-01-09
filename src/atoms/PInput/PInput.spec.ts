import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { ElInput } from 'element-plus'
import PInput from '.'
import type { PInputProps } from './PInputTypes'
import { PIPulse } from '@/atoms/PIcon/components'

const propsValue: PInputProps = {
  pType: 'textarea',
  pMaxlength: 23,
  pMinlength: 11,
  pShowWordLimit: false,
  pPlaceholder: 'placeholder',
  pClearable: false,
  pFormatter: vi.fn(),
  pParser: vi.fn(),
  pShowPassword: false,
  pDisabled: false,
  pSize: 'small',
  pRows: 2,
  pAutosize: false,
  pAutocomplete: 'off',
  pName: 'name',
  pReadonly: false,
  pMax: 11,
  pMin: 1,
  pStep: 1,
  pResize: 'none',
  pAutofocus: true,
  pForm: 'form',
  pLabel: 'label',
  pTabindex: 0,
  pValidateEvent: true,
  pInputStyle: 'inputStyle'
}
const createWrapper = (defaultProps = propsValue) =>
  mount(PInput, {
    props: defaultProps
  })

describe('pInput', () => {
  describe('props', () => {
    it('should render correctly', () => {
      const wrapper: VueWrapper<any> = createWrapper()
      const componentVM = wrapper.findComponent(ElInput).vm
      expect(componentVM.type).toBe(propsValue.pType)
      expect(wrapper.find('textarea').attributes('maxlength')).toBe(
        propsValue.pMaxlength?.toString()
      )
      expect(wrapper.find('textarea').attributes('minlength')).toBe(
        propsValue.pMinlength?.toString()
      )
      expect(componentVM.showWordLimit).toBe(propsValue.pShowWordLimit)
      expect(componentVM.placeholder).toBe(propsValue.pPlaceholder)
      expect(componentVM.clearable).toBe(propsValue.pClearable)
      expect(componentVM.formatter).toBe(propsValue.pFormatter)
      expect(componentVM.parser).toBe(propsValue.pParser)
      expect(componentVM.showPassword).toBe(propsValue.pShowPassword)
      expect(componentVM.disabled).toBe(propsValue.pDisabled)
      expect(componentVM.size).toBe(propsValue.pSize)
      expect(wrapper.find('textarea').attributes('rows')).toBe(
        propsValue.pRows?.toString()
      )
      expect(componentVM.autosize).toBe(propsValue.pAutosize)
      expect(componentVM.autocomplete).toBe(propsValue.pAutocomplete)
      expect(wrapper.find('textarea').attributes('name')).toBe(propsValue.pName)
      expect(componentVM.readonly).toBe(propsValue.pReadonly)
      expect(wrapper.find('textarea').attributes('max')).toBe(
        propsValue.pMax?.toString()
      )
      expect(wrapper.find('textarea').attributes('min')).toBe(
        propsValue.pMin?.toString()
      )
      expect(wrapper.find('textarea').attributes('step')).toBe(
        propsValue.pStep?.toString()
      )
      expect(componentVM.resize).toBe(propsValue.pResize)
      expect(wrapper.find('textarea').attributes('autofocus')).toBe('')
      expect(componentVM.form).toBe(propsValue.pForm)
      expect(componentVM.label).toBe(propsValue.pLabel)
      expect(componentVM.tabindex).toBe(propsValue.pTabindex)
      expect(componentVM.validateEvent).toBe(propsValue.pValidateEvent)
      expect(componentVM.inputStyle).toBe(propsValue.pInputStyle)
    })
    it('should display prefix icon if exist', () => {
      const wrapper = createWrapper({
        ...propsValue,
        pType: 'input',
        pPrefixIcon: PIPulse
      })
      const prefixIcon = wrapper.find('.el-input__icon')
      expect(prefixIcon.exists()).toBeTruthy()
    })
    it('should display suffix icon if exist', () => {
      const wrapper = createWrapper({
        ...propsValue,
        pType: 'input',
        pSuffixIcon: PIPulse
      })
      const suffixIcon = wrapper.find('.el-input__icon')
      expect(suffixIcon.exists()).toBeTruthy()
    })
  })
})
