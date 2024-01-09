import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { ElFormItem } from 'element-plus'
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
  pValidateStatus: 'error'
}
const createWrapper = () => mount(PFormItem, {
  props: propsValue
})

describe('pFormItem', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const componentVM = wrapper.findComponent(ElFormItem).vm
    expect(componentVM.prop).toBe(propsValue.pProp)
    expect(componentVM.label).toBe(propsValue.pLabel)
    expect(componentVM.labelWidth).toBe(propsValue.pLabelWidth)
    expect(componentVM.required).toBe(propsValue.pRequired)
    expect(componentVM.rules).toStrictEqual(propsValue.pRules)
    expect(componentVM.error).toBe(propsValue.pError)
    expect(componentVM.showMessage).toBe(propsValue.pShowMessage)
    expect(componentVM.inlineMessage).toBe(propsValue.pInlineMessage)
    expect(componentVM.size).toBe(propsValue.pSize)
    expect(componentVM.for).toBe(propsValue.pFor)
    expect(componentVM.validateStatus).toBe(propsValue.pValidateStatus)
  })
})
