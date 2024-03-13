import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PScrollbar from '.'
import type { PScrollbarProps } from './PScrollbarTypes'

const propsValue: PScrollbarProps = {
  pHeight: 12,
  pMaxHeight: 15,
  pNative: false,
  pWrapStyle: 'wrapStyle',
  pViewStyle: 'viewStyle',
  pWrapClass: 'wrapClass',
  pViewClass: 'viewClass',
  pNoresize: false,
  pTag: 'div',
  pAlways: false,
  pMinSize: 20,
  pId: 'id',
  pRole: 'role',
  pAriaLabel: 'ariaLabel',
  pAriaOrientation: 'horizontal',
}
const createWrapper = () => mount(PScrollbar, {
  props: propsValue,
})

describe('pScrollbar', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const component = wrapper.findComponent({ name: 'ElScrollbar' })

    const expectedProps = {
      height: propsValue.pHeight,
      maxHeight: propsValue.pMaxHeight,
      native: propsValue.pNative,
      wrapStyle: propsValue.pWrapStyle,
      viewStyle: propsValue.pViewStyle,
      wrapClass: propsValue.pWrapClass,
      viewClass: propsValue.pViewClass,
      noresize: propsValue.pNoresize,
      tag: propsValue.pTag,
      always: propsValue.pAlways,
      minSize: propsValue.pMinSize,
      id: propsValue.pId,
      role: propsValue.pRole,
      ariaLabel: propsValue.pAriaLabel,
      ariaOrientation: propsValue.pAriaOrientation,
    }
    expect(component.props()).toMatchObject(expectedProps)
  })
})
