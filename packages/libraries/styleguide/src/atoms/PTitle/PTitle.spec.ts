// Import necessary modules

import { shallowMount } from '@vue/test-utils'
import type { PTitleProps } from './PTitleTypes'

import PTitle from './'

const pTitle = 'Lorem ipsum'
const baseProps: PTitleProps = {
  pTitle,
  pIconName: 'pulse',
}

describe('tests for p-title', () => {
  it('renders the component', () => {
    const wrapper = shallowMount(PTitle, {
      props: baseProps,
    })

    const PTitleElement = wrapper.findComponent({ name: 'PTitle' })

    expect(PTitleElement.exists()).toBeTruthy()
  })

  it('renders with an icon', () => {
    const wrapper = shallowMount(PTitle, {
      props: {
        ...baseProps,
        pIconName: 'person',
      },
    })

    const iconElement = wrapper.findComponent({ name: 'PIcon' })

    expect(iconElement.exists()).toBeTruthy()
  })
})
