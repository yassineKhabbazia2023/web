import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PRow from '.'
import type { PRowProps } from './PRowTypes'

const propsValue: PRowProps = {
  pGutter: 0,
  pJustify: 'start',
  pAlign: 'middle',
  pTag: 'div',
}
const createWrapper = () => shallowMount(PRow, {
  props: propsValue,
  global: {
    stubs: {
      ElRow: {
        name: 'ElRow',
        template: '<div><slot /></div>',
        props: [
          'gutter',
          'justify',
          'align',
          'tag',
        ],
      },
    },
  },
})

describe('pRow', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const elRow = wrapper.findComponent({ name: 'ElRow' })
    const elRowProps = elRow.props()
    expect(elRowProps.gutter).toBe(propsValue.pGutter)
    expect(elRowProps.justify).toBe(propsValue.pJustify)
    expect(elRowProps.align).toBe(propsValue.pAlign)
    expect(elRowProps.tag).toBe(propsValue.pTag)
  })
})
