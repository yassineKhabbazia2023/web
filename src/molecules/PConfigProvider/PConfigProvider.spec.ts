import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PConfigProvider from '.'
import type { PConfigProviderProps } from './PConfigProviderTypes'
import fr from 'element-plus/es/locale/lang/fr'
import en from 'element-plus/es/locale/lang/en'

const defaultProps: PConfigProviderProps = {
  pSize: 'small',
  pZIndex: 1,
  pNamespace: 'el',
  pButton: undefined,
  pMessage: { max: 1 },
}
function createWrapper(overrideProps: Partial<PConfigProviderProps> = {}) {
  const props = {
    ...defaultProps,
    ...overrideProps,
  }
  return mount(PConfigProvider, {
    props,
  })
}

describe('pConfigProvider', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const component = wrapper.findComponent({ name: 'ElConfigProvider' })

    const expectedProps = {
      locale: fr,
      size: defaultProps.pSize,
      zIndex: defaultProps.pZIndex,
      namespace: defaultProps.pNamespace,
      button: defaultProps.pButton,
      message: defaultProps.pMessage,
    }
    expect(component.props()).toMatchObject(expectedProps)
  })
  it('should render correctly when locale is defined', () => {
    const wrapper: VueWrapper<any> = createWrapper({
      pLocale: en,
    })
    const component = wrapper.findComponent({ name: 'ElConfigProvider' })

    const expectedProps = {
      locale: en,
      size: defaultProps.pSize,
      zIndex: defaultProps.pZIndex,
      namespace: defaultProps.pNamespace,
      button: defaultProps.pButton,
      message: defaultProps.pMessage,
    }
    expect(component.props()).toMatchObject(expectedProps)
  })
})
