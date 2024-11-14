import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import PInput from '.'
import type { PInputProps } from './PInputTypes'

const mockedCb = vi.fn()
const propsValue: PInputProps = {
  pType: 'textarea',
  pMaxlength: 23,
  pMinlength: 11,
  pShowWordLimit: false,
  pPlaceholder: 'placeholder',
  pClearable: false,
  pFormatter: mockedCb,
  pParser: mockedCb,
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
  pInputStyle: 'inputStyle',
}
const createWrapper = (defaultProps = propsValue, hasSlots = false) => {
  const testSlots = {
    prefix: 'Prefix Content',
    suffix: 'Suffix Content',
    append: 'Append Content',
    prepend: 'Prepend Content',
  }
  const slots = hasSlots ? testSlots : undefined

  return shallowMount(PInput, {
    props: defaultProps,
    slots,
    global: {
      stubs: {
        ElInput: {
          name: 'ElInput',
          template: `<div>
<div v-if="$slots.prefix" class="el-input__prefix"><slot name="prefix" /></div>
<div v-if="$slots.suffix" class="el-input__suffix"><slot name="suffix" /></div>
<div v-if="$slots.prepend" class="el-input-group__prepend"><slot name="prepend" /></div>
<div v-if="$slots.append" class="el-input-group__append"><slot name="append" /></div>
          </div>`,
          props: [
            'containerRole',
            'id',
            'formatter',
            'parser',
            'prefixIcon',
            'suffixIcon',
            'type',
            'showWordLimit',
            'placeholder',
            'clearable',
            'showPassword',
            'disabled',
            'size',
            'autosize',
            'autocomplete',
            'readonly',
            'resize',
            'autofocus',
            'form',
            'label',
            'tabindex',
            'validateEvent',
            'inputStyle',
          ],
        },
      },
    },
  })
}

describe('pInput', () => {
  describe('props', () => {
    it('should render correctly', () => {
      const wrapper: VueWrapper<any> = createWrapper()

      const component = wrapper.findComponent({ name: 'ElInput' })

      const expectedProps = {
        containerRole: undefined,
        id: undefined,
        formatter: mockedCb,
        parser: mockedCb,
        prefixIcon: undefined,
        suffixIcon: undefined,
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
        inputStyle: propsValue.pInputStyle,
      }

      const props = component.props()
      expect(props).toMatchObject(expectedProps)
    })

    it('should display prefix icon if exist', () => {
      const wrapper = createWrapper({
        ...propsValue,
        pType: 'input',
        pPrefixIconName: 'xCircleFill',
      })
      const elInput = wrapper.findComponent({ name: 'ElInput' })
      expect(elInput.props('prefixIcon')).toBeDefined()
    })

    it('should display suffix icon if exist', () => {
      const wrapper = createWrapper({
        ...propsValue,
        pType: 'input',
        pSuffixIconName: 'pulse',
      })
      const elInput = wrapper.findComponent({ name: 'ElInput' })
      expect(elInput.props('suffixIcon')).toBeDefined()
    })
    it('should display slots if exist', () => {
      const wrapper = createWrapper({
        ...propsValue,
        pType: 'input',
      }, true)
      expect(wrapper.find('.el-input__prefix').text()).toBe('Prefix Content')
      expect(wrapper.find('.el-input__suffix').text()).toBe('Suffix Content')
      expect(wrapper.find('.el-input-group__append').text()).toBe('Append Content')
      expect(wrapper.find('.el-input-group__prepend').text()).toBe('Prepend Content')
    })
    it('should not display slots if not exist', () => {
      const wrapper = createWrapper({
        ...propsValue,
        pType: 'input',
      })

      expect(wrapper.find('.el-input__prefix').exists()).toBeFalsy()
      expect(wrapper.find('.el-input__suffix').exists()).toBeFalsy()
      expect(wrapper.find('.el-input-group__append').exists()).toBeFalsy()
      expect(wrapper.find('.el-input-group__prepend').exists()).toBeFalsy()
    })
    it('should add and remove p-input--focus accordingly base on focus and blur event', async () => {
      const wrapper = createWrapper({
        ...propsValue,
        pType: 'input',
      })
      wrapper.findComponent({ name: 'ElInput' }).vm.$emit('focus')
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.p-input--focused').exists()).toBeTruthy()

      wrapper.findComponent({ name: 'ElInput' }).vm.$emit('blur')
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.p-input--focused').exists()).toBeFalsy()
    })
  })
})
