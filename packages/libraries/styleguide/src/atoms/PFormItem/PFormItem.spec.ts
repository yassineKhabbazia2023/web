import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PFormItem from '.'
import type { PFormItemProps } from './PFormItemTypes'

const propsValue: PFormItemProps = {
  pProp: undefined,
  pLabel: 'label',
  pLabelWidth: '100px',
  pRequired: true,
  pRules: [],
  pError: 'error',
  pShowMessage: true,
  pInlineMessage: 'inline message',
  pSize: 'small',
  pFor: 'for',
  pValidateStatus: 'error',
}
const createWrapper = () => shallowMount(PFormItem, {
  props: propsValue,
  global: {
    stubs: {
      ElFormItem: {
        name: 'ElFormItem',
        template: '<div><slot /></div>',
        props: [
          'prop',
          'label',
          'labelWidth',
          'required',
          'rules',
          'error',
          'showMessage',
          'inlineMessage',
          'size',
          'for',
          'validateStatus',
        ],
      },
    },
  },
})

describe('pFormItem', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const component = wrapper.findComponent({ name: 'ElFormItem' })

    const expectedProps = {
      prop: propsValue.pProp,
      label: propsValue.pLabel,
      labelWidth: propsValue.pLabelWidth,
      required: propsValue.pRequired,
      rules: propsValue.pRules,
      error: propsValue.pError,
      showMessage: propsValue.pShowMessage,
      inlineMessage: propsValue.pInlineMessage,
      size: propsValue.pSize,
      for: propsValue.pFor,
      validateStatus: propsValue.pValidateStatus,
    }

    expect(component.props()).toMatchObject(expectedProps)
  })
})
