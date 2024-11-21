import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import PLoader from './'

describe('pLoader', () => {
  it('renders', () => {
    const wrapper = shallowMount(PLoader, {
      props: {
        pType: 'primary',
      },
    })
    expect(wrapper.exists()).toBeTruthy()
  })
})
