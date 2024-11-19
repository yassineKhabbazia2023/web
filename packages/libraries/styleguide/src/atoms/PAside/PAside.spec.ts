import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PAside from '.'

const propsValue = {
  pWidth: '200px',
}
const createWrapper = () => shallowMount(PAside, {
  props: propsValue,
  slots: {
    default: 'aside',
  },
  global: {
    stubs: {
      ElAside: {
        name: 'ElAside',
        template: '<div><slot /></div>',
        props: ['width'],
      },
    },
  },
})

describe('pAside', () => {
  it('render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const elAside = wrapper.findComponent({ name: 'ElAside' })
    expect(elAside.props('width')).toBe(propsValue.pWidth)
    expect(elAside.text()).toBe('aside')
  })
})
