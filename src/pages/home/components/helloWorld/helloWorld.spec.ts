import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HelloWorld from './'

describe('test HelloWorld', () => {
  it('can click on the button and bump the count', async () => {
    const wrapper = mount(HelloWorld)
    const button = wrapper.find('[data-testid="increment-button"]')
    expect(button.text()).toContain('0')

    await button.trigger('click')
    expect(button.text()).toContain('1')
  })
})
