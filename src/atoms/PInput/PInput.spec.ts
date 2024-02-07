import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
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
    props: defaultProps,
    stubs: {
      ElInput: '<div>toto</div>'
    }
  })

describe('pInput', () => {
  describe('props', () => {
    it('should render correctly', () => {
      const wrapper: VueWrapper<any> = createWrapper()

      const component = wrapper.findComponent({ name: 'ElInput' })

      const expectedProps = {
        containerRole: undefined,
        id: undefined,
        modelValue: '',
        prefixIcon: null,
        suffixIcon: null,
        type: propsValue.pType,
        showWordLimit: propsValue.pShowWordLimit,
        placeholder: propsValue.pPlaceholder,
        clearable: propsValue.pClearable,
        showPassword: propsValue.pShowPassword,
        disabled: propsValue.pDisabled,
        size: propsValue.pSize,
        autosize: propsValue.pAutosize,
        autocomplete: propsValue.pAutocomplete,
        readonly: propsValue.pReadonly,
        resize: propsValue.pResize,
        autofocus: propsValue.pAutofocus,
        form: propsValue.pForm,
        label: propsValue.pLabel,
        tabindex: propsValue.pTabindex,
        validateEvent: propsValue.pValidateEvent,
        inputStyle: propsValue.pInputStyle
      }

      const props = component.props()
      delete props.formatter
      delete props.parser
      expect(props).toMatchObject(expectedProps)
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
