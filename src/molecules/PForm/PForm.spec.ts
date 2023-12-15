import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { ElForm } from 'element-plus'
import PForm from '.'
import type { PFormProps } from './PFormTypes'

const propsValue: PFormProps = {
  pModel: undefined,
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
  it('should render correctly', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const componentVM = wrapper.findComponent(ElForm).vm
    expect(componentVM.model).toBe(propsValue.pModel)
    expect(componentVM.rules).toBe(propsValue.pRules)
    expect(componentVM.inline).toBe(propsValue.pInline)
    expect(componentVM.labelPosition).toBe(propsValue.pLabelPosition)
    expect(componentVM.labelWidth).toBe(propsValue.pLabelWidth)
    expect(componentVM.labelSuffix).toBe(propsValue.pLabelSuffix)
    expect(componentVM.hideRequiredAsterisk).toBe(propsValue.pHideRequiredAsterisk)
    expect(componentVM.requireAsteriskPosition).toBe(propsValue.pRequireAsteriskPosition)
    expect(componentVM.showMessage).toBe(propsValue.pShowMessage)
    expect(componentVM.inlineMessage).toBe(propsValue.pInlineMessage)
    expect(componentVM.statusIcon).toBe(propsValue.pStatusIcon)
    expect(componentVM.validateOnRuleChange).toBe(propsValue.pValidateOnRuleChange)
    expect(componentVM.size).toBe(propsValue.pSize)
    expect(componentVM.disabled).toBe(propsValue.pDisabled)
    expect(componentVM.scrollToError).toBe(propsValue.pScrollToError)
    expect(componentVM.scrollIntoViewOptions).toBe(propsValue.pScrollIntoViewOptions)
  })
})
