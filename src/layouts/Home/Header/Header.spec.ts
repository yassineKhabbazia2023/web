import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Header from './'

describe('header', () => {
  it('should display header section', () => {
    const wrapper = mount(Header)
    const header = wrapper.find('header')

    expect(header.exists())
  })
})
