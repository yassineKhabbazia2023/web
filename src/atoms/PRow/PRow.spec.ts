import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { ElRow } from 'element-plus'
import PRow from '.'
import type { PRowProps } from './PRowTypes'

const propsValue: PRowProps = {
  pGutter: 0,
  pJustify: 'start',
  pAlign: 'middle',
  pTag: 'div'
}
const createWrapper = () => mount(PRow, {
  props: propsValue
})

describe('pRow', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const componentVM = wrapper.findComponent(ElRow).vm
    expect(componentVM.gutter).toBe(propsValue.pGutter)
    expect(componentVM.justify).toBe(propsValue.pJustify)
    expect(componentVM.align).toBe(propsValue.pAlign)
    expect(componentVM.tag).toBe(propsValue.pTag)
  })
})
