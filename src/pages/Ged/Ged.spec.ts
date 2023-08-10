import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Ged from './'

describe('ged', () => {
  it('renders correctly', () => {
    const wrapper = mount(Ged)
    expect(wrapper.exists()).toBeTruthy()
  })
})
