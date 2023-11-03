import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PLoader from './'

describe('pLoader', () => {
  it('renders', () => {
    const wrapper = mount(PLoader, {
      props: {
        pType: 'primary'
      }
    })
    expect(wrapper.exists()).toBeTruthy()
  })
})
