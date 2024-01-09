import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { ElTabs } from 'element-plus'
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
    const componentVM = wrapper.findComponent(ElTabs).vm
    expect(componentVM.modelValue).toBe(propsValue.modelValue)
    expect(componentVM.type).toBe(propsValue.pType)
    expect(componentVM.closable).toBe(propsValue.pClosable)
    expect(componentVM.addable).toBe(propsValue.pAddable)
    expect(componentVM.editable).toBe(propsValue.pEditable)
    expect(componentVM.tabPosition).toBe(propsValue.pTabPosition)
    expect(componentVM.stretch).toBe(propsValue.pStretch)
    expect(componentVM.beforeLeave).toBe(propsValue.pBeforeLeave)
  })

  it('should re-link v-model', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    expect(wrapper.props('modelValue')).toBe(propsValue.modelValue)
    wrapper.setProps({ modelValue: '2' })
    await nextTick()
    expect(wrapper.props('modelValue')).toBe('2')
  })
})
