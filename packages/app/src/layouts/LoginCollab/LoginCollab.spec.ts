
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LoginCollab from '.'
import { OFFICIAL_WEBSITE_URL } from '@pulse/core'

const createWrapper = () => shallowMount(LoginCollab, {
  global: {
    stubs: {
      'PRow': {
        name: 'PRow',
        template: '<div><slot /></div>',
      },
      'PCol': {
        name: 'PCol',
        template: '<div><slot /></div>',
      },
    },
  },
})

describe('loginCollab', () => {
  const wrapper = createWrapper()
  it('should correctly display the login collab page', () => {
    const loginImage = wrapper.findComponent({ name: 'PImage' })
    const loginFooter = wrapper.find('[data-testid=login-collab-footer]')

    expect(loginImage.exists()).toBeTruthy()
    expect(loginFooter.exists()).toBeTruthy()
  })

  it('has a link in the brand', () => {
    const brandLink = wrapper.find('[data-testid=login-brand-link]')
    expect(brandLink.exists()).toBeTruthy()
    expect(brandLink.attributes('href')).toBe(OFFICIAL_WEBSITE_URL)
  })
})
