import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import PTabs from '.'
import type { PTabsProps } from './PTabsTypes'
import { nextTick } from 'vue'

const propsValue: PTabsProps = {
  modelValue: 'a tab',
  pType: 'card',
  pClosable: true,
  pAddable: true,
  pEditable: true,
  pTabPosition: 'top',
  pStretch: false,
  pBeforeLeave: vi.fn()
}

const createWrapper = () => mount(PTabs, {
  props: propsValue
})

describe('pTabs', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const component = wrapper.findComponent({ name: 'ElTabs' })

    const expectedProps = {
      modelValue: propsValue.modelValue,
      type: propsValue.pType,
      closable: propsValue.pClosable,

      addable: propsValue.pAddable,
      editable: propsValue.pEditable,
      tabPosition: propsValue.pTabPosition,

      stretch: propsValue.pStretch,
      beforeLeave: propsValue.pBeforeLeave
    }
    expect(component.props()).toMatchObject(expectedProps)
  })

  it('should re-link v-model', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    expect(wrapper.props('modelValue')).toBe(propsValue.modelValue)
    wrapper.setProps({ modelValue: '2' })
    await nextTick()
    expect(wrapper.props('modelValue')).toBe('2')
  })
})
