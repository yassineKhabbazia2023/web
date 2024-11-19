import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PCHeader from '.'

const propsValue = {
  pHeight: '60px',
}
const createWrapper = () => shallowMount(PCHeader, {
  props: propsValue,
  slots: {
    default: 'header',
  },
  global: {
    stubs: {
      ElHeader: {
        name: 'ElHeader',
        template: '<div><slot /></div>',
      },
    },
  },
})

describe('pcHeader', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const elHeader = wrapper.findComponent({ name: 'ElHeader' })
    expect(elHeader.attributes('height')).toBe(propsValue.pHeight)
    expect(elHeader.text()).toBe('header')
  })
})
