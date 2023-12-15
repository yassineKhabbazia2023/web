import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { ElSwitch } from 'element-plus'
import PSwitch from '.'
import type { PSwitchProps } from './PSwitchTypes'

const propsValue: PSwitchProps = {
  pDisabled: true,
  pLoading: false,
  pSize: 'small',
  pWidth: '20px',
  pInlinePrompt: false,
  pActiveIcon: 'activeIcon',
  pInactiveIcon: 'inactiveIcon',
  pActiveActionIcon: 'activeActionIcon',
  pInactiveActionIcon: 'inactiveActionIcon',
  pActiveText: 'activeText',
  pInactiveText: 'inactiveText',
  pActiveValue: true,
  pInactiveValue: false,
  pActiveColor: 'red',
  pInactiveColor: 'blue',
  pBorderColor: 'green',
  pName: 'name',
  pValidateEvent: true,
  pBeforeChange: vi.fn(),
  pId: 'id',
  pTabIndex: 0,
  pLabel: 'label'
}
const createWrapper = () => mount(PSwitch, {
  props: propsValue
})

describe('pSwitch', () => {
  it('should render correctly', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const componentVM = wrapper.findComponent(ElSwitch).vm
    expect(componentVM.loading).toBe(propsValue.pLoading)
    expect(componentVM.size).toBe(propsValue.pSize)
    expect(componentVM.width).toBe(propsValue.pWidth)
    expect(componentVM.inlinePrompt).toBe(propsValue.pInlinePrompt)
    expect(componentVM.activeIcon).toBe(propsValue.pActiveIcon)
    expect(componentVM.inactiveIcon).toBe(propsValue.pInactiveIcon)
    expect(componentVM.activeActionIcon).toBe(propsValue.pActiveActionIcon)
    expect(componentVM.inactiveActionIcon).toBe(propsValue.pInactiveActionIcon)
    expect(componentVM.activeText).toBe(propsValue.pActiveText)
    expect(componentVM.inactiveText).toBe(propsValue.pInactiveText)
    expect(componentVM.activeValue).toBe(propsValue.pActiveValue)
    expect(componentVM.inactiveValue).toBe(propsValue.pInactiveValue)
    expect(componentVM.activeColor).toBe(propsValue.pActiveColor)
    expect(componentVM.inactiveColor).toBe(propsValue.pInactiveColor)
    expect(componentVM.borderColor).toBe(propsValue.pBorderColor)
    expect(componentVM.name).toBe(propsValue.pName)
    expect(componentVM.validateEvent).toBe(propsValue.pValidateEvent)
    expect(componentVM.beforeChange).toBe(propsValue.pBeforeChange)
    expect(componentVM.id).toBe(propsValue.pId)
    expect(wrapper.find('.el-switch').attributes('tabindex'))
      .toBe(propsValue.pTabIndex?.toString())
    expect(wrapper.find('.el-switch').attributes('label')).toBe(propsValue.pLabel)
  })
})
