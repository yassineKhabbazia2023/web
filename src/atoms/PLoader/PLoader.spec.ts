import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PLoader from './'

describe('pLoader', () => {
  it('renders', () => {
    const wrapper = mount(PLoader, {
      props: {
        type: 'primary'
      }
    })

    expect(wrapper.exists()).toBeTruthy()
  })
})
