import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { ElScrollbar } from 'element-plus'
import PScrollbar from '.'

const propsValue = {
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
  pAriaOrientation: 'horizontal'
}
const createWrapper = () => mount(PScrollbar, {
  props: propsValue
})

describe('pScrollbar', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const componentVM = wrapper.findComponent(ElScrollbar).vm
    expect(componentVM.height).toBe(propsValue.pHeight)
    expect(componentVM.maxHeight).toBe(propsValue.pMaxHeight)
    expect(componentVM.native).toBe(propsValue.pNative)
    expect(componentVM.wrapStyle).toBe(propsValue.pWrapStyle)
    expect(componentVM.viewStyle).toBe(propsValue.pViewStyle)
    expect(componentVM.wrapClass).toBe(propsValue.pWrapClass)
    expect(componentVM.viewClass).toBe(propsValue.pViewClass)
    expect(componentVM.noresize).toBe(propsValue.pNoresize)
    expect(componentVM.tag).toBe(propsValue.pTag)
    expect(componentVM.always).toBe(propsValue.pAlways)
    expect(componentVM.minSize).toBe(propsValue.pMinSize)
    expect(wrapper.find('.el-scrollbar').attributes('id')).toBe(propsValue.pId)
    expect(wrapper.find('.el-scrollbar').attributes('role')).toBe(propsValue.pRole)
    expect(wrapper.find('.el-scrollbar').attributes('arialabel')).toBe(propsValue.pAriaLabel)
    expect(wrapper.find('.el-scrollbar').attributes('ariaorientation'))
      .toBe(propsValue.pAriaOrientation)
  })
})
