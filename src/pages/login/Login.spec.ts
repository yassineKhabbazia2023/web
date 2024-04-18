import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Login from './'

describe('test Login', () => {
  it('display the title', () => {
    const wrapper = mount(Login)
    const title = wrapper.find('[data-testid="title"]')
    expect(title.text()).toBe('This is the login page')
  })
})
