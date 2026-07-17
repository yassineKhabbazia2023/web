import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'

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
  pLabel: 'label',
}
const createWrapperWithProps = (props: Partial<PSwitchProps> = {}, modelValue = false) => mount(PSwitch, {
  props: {
    ...propsValue,
    ...props,
    modelValue,
  },
})

describe('pSwitch', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapperWithProps({}, false)
    const component = wrapper.findComponent({ name: 'ElSwitch' })
    const expectedProps = {
      modelValue: false,
      disabled: propsValue.pDisabled,
      loading: propsValue.pLoading,
      size: propsValue.pSize,
      width: propsValue.pWidth,
      inlinePrompt: propsValue.pInlinePrompt,
      activeIcon: propsValue.pActiveIcon,
      inactiveIcon: propsValue.pInactiveIcon,
      activeActionIcon: propsValue.pActiveActionIcon,
      inactiveActionIcon: propsValue.pInactiveActionIcon,
      activeText: propsValue.pActiveText,
      inactiveText: propsValue.pInactiveText,
      activeValue: propsValue.pActiveValue,
      inactiveValue: propsValue.pInactiveValue,
      name: propsValue.pName,
      validateEvent: propsValue.pValidateEvent,
      beforeChange: propsValue.pBeforeChange,
      id: propsValue.pId,
      ariaLabel: propsValue.pLabel,
    }

    expect(component.props()).toMatchObject(expectedProps)

    expect(wrapper.find('.el-switch__input').attributes('aria-label'))
      .toBe(propsValue.pLabel)

    expect(wrapper.find('.el-switch').attributes('tabindex'))
      .toBe(propsValue.pTabIndex?.toString())

    const { pBorderColor: border, pActiveColor: on, pInactiveColor: off } = propsValue
    const pfx = '--el-switch-'
    const sfx = '-color'

    const expectedStyle = `${pfx}border${sfx}: ${border}; ${pfx}on${sfx}: ${on}; ${pfx}off${sfx}: ${off};`
    expect(wrapper.attributes('style')).toBe(expectedStyle)
  })

  it('should disable switch when loading', () => {
    const wrapper: VueWrapper<any> = createWrapperWithProps({
      pDisabled: false,
      pLoading: true,
    })

    const component = wrapper.findComponent({ name: 'ElSwitch' })

    expect(component.props('loading')).toBe(true)
    expect(component.props('disabled')).toBe(true)
  })

  it('should emit model update from ElSwitch', async () => {
    const wrapper: VueWrapper<any> = createWrapperWithProps({}, false)
    const component = wrapper.findComponent({ name: 'ElSwitch' })

    await component.vm.$emit('update:modelValue', true)

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })
})
