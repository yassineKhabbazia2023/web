import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LaunchCard from '.'

describe('test LaunchCard', () => {
  it('should contain Hello Word text', () => {
    const wrapper = mount(LaunchCard)
    const helloWorld = wrapper.find('.hello-world')

    expect(helloWorld.text()).toBe('Hello World')
  })
})
