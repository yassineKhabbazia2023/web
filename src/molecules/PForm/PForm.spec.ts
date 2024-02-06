import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import PForm from '.'
import type { PFormProps } from './PFormTypes'

const propsValue: PFormProps = {
  pModel: {},
  pRules: undefined,
  pInline: false,
  pLabelPosition: 'right',
  pLabelWidth: '200px',
  pLabelSuffix: 'suffix',
  pHideRequiredAsterisk: false,
  pRequireAsteriskPosition: 'left',
  pShowMessage: true,
  pInlineMessage: false,
  pStatusIcon: false,
  pValidateOnRuleChange: true,
  pSize: undefined,
  pDisabled: false,
  pScrollToError: false,
  pScrollIntoViewOptions: undefined
}
const createWrapper = () => mount(PForm, {
  props: propsValue
})

describe('pForm', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const component = wrapper.findComponent({ name: 'ElForm' })

    const expectedProps = {
      model: propsValue.pModel,
      rules: propsValue.pRules,
      inline: propsValue.pInline,
      labelPosition: propsValue.pLabelPosition,
      labelWidth: propsValue.pLabelWidth,
      labelSuffix: propsValue.pLabelSuffix,
      hideRequiredAsterisk: propsValue.pHideRequiredAsterisk,
      requireAsteriskPosition: propsValue.pRequireAsteriskPosition,
      showMessage: propsValue.pShowMessage,
      inlineMessage: propsValue.pInlineMessage,
      statusIcon: propsValue.pStatusIcon,
      validateOnRuleChange: propsValue.pValidateOnRuleChange,
      size: propsValue.pSize,
      disabled: propsValue.pDisabled,
      scrollToError: propsValue.pScrollToError,
      scrollIntoViewOptions: propsValue.pScrollIntoViewOptions
    }

    expect(component.props()).toMatchObject(expectedProps)
  })

  describe('exposed functions', () => {
    /* Each test manually triggers the exposed function to grow the "branch" coverage
    these function are already tested by EP which makes it acceptable.
    We're then using a mock afterward to check how the function is actually called
    to have a real statement, functions and lines coverage */

    it('should properly call resetFields', () => {
      const wrapper: VueWrapper<any> = createWrapper()
      // Use to fake real trigger for branch coverage as it's already tested by EP
      wrapper.vm.resetFields()

      const mockResetFields = vi.fn()
      wrapper.vm.$refs.formRef.resetFields = mockResetFields
      wrapper.vm.resetFields(['champ1', 'champ2'])
      expect(mockResetFields).toHaveBeenCalledWith(['champ1', 'champ2'])
    })

    it('should properly call validate', () => {
      const wrapper: VueWrapper<any> = createWrapper()
      wrapper.vm.validate()

      const mockValidate = vi.fn()
      const mockedCallbackFunction = vi.fn()
      wrapper.vm.$refs.formRef.validate = mockValidate
      wrapper.vm.validate(mockedCallbackFunction)
      expect(mockValidate).toHaveBeenCalledWith(mockedCallbackFunction)
    })

    it('should properly call validateField', () => {
      const wrapper: VueWrapper<any> = createWrapper()
      wrapper.vm.validateField()

      const mockValidateField = vi.fn()
      const mockedCallbackFunction = vi.fn()
      wrapper.vm.$refs.formRef.validateField = mockValidateField
      wrapper.vm.validateField([], mockedCallbackFunction)
      expect(mockValidateField).toHaveBeenCalledWith(
        [],
        mockedCallbackFunction
      )
    })

    it('should properly call scrollToField', () => {
      const wrapper: VueWrapper<any> = createWrapper()
      wrapper.vm.scrollToField()

      const mockScrollToField = vi.fn()
      const formItemProp = 'a prop'
      wrapper.vm.$refs.formRef.scrollToField = mockScrollToField
      wrapper.vm.scrollToField(formItemProp)
      expect(mockScrollToField).toHaveBeenCalledWith(formItemProp)
    })

    it('should properly call clearValidate', () => {
      const wrapper: VueWrapper<any> = createWrapper()
      wrapper.vm.clearValidate()

      const mockClearValidate = vi.fn()
      const formItemProp = ['some', 'props']
      wrapper.vm.$refs.formRef.clearValidate = mockClearValidate
      wrapper.vm.clearValidate(formItemProp)
      expect(mockClearValidate).toHaveBeenCalledWith(formItemProp)
    })
  })
})
