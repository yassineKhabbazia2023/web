import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HelloWorld from './'

describe('helloWorld', () => {
  it('can click on the button and bump the count', async () => {
    const wrapper = mount(HelloWorld)
    expect(wrapper.exists()).toBeTruthy()
  })
})
