import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PConfigProvider from '.'
import { ElConfigProvider } from 'element-plus'
import type { PConfigProviderProps } from './PConfigProviderTypes'

const propsValue: PConfigProviderProps = {
  pLocale: undefined,
  pSize: 'small',
  pZIndex: 1,
  pNamespace: 'el',
  pButton: undefined,
  pMessage: { max: 1 }
}
const createWrapper = () => mount(PConfigProvider, {
  props: propsValue
})

describe('pConfigProvider', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const componentVM = wrapper.findComponent(ElConfigProvider).vm
    expect(componentVM.locale).toBe(propsValue.pLocale)
    expect(componentVM.size).toBe(propsValue.pSize)
    expect(componentVM.zIndex).toBe(propsValue.pZIndex)
    expect(componentVM.namespace).toBe(propsValue.pNamespace)
    expect(componentVM.button).toBe(propsValue.pButton)
    expect(componentVM.message).toStrictEqual(propsValue.pMessage)
  })
})
