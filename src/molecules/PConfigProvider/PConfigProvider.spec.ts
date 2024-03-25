import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PConfigProvider from '.'
import type { PConfigProviderProps } from './PConfigProviderTypes'

const propsValue: PConfigProviderProps = {
  pLocale: undefined,
  pSize: 'small',
  pZIndex: 1,
  pNamespace: 'el',
  pButton: undefined,
  pMessage: { max: 1 },
}
const createWrapper = () => mount(PConfigProvider, {
  props: propsValue,
})

describe('pConfigProvider', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const component = wrapper.findComponent({ name: 'ElConfigProvider' })

    const expectedProps = {
      locale: propsValue.pLocale,
      size: propsValue.pSize,
      zIndex: propsValue.pZIndex,
      namespace: propsValue.pNamespace,
      button: propsValue.pButton,
      message: propsValue.pMessage,
    }
    expect(component.props()).toMatchObject(expectedProps)
  })
})
