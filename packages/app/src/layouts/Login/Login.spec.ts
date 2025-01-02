import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import Login from './'
import { OFFICIAL_WEBSITE_URL } from '@pulse/core'

const mockRoute = vi.fn(() => ({
  name: 'mocked route name',
}))
vi.mock('vue-router', () => ({
  useRoute: () => ({
    route: mockRoute,
  }),
}))
const createWrapper = () => shallowMount(Login, {
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

describe('login', () => {
  const wrapper = createWrapper()

  it('has links in the footer', () => {
    expect(wrapper.find('.footer').exists()).toBeTruthy()
  })

  it('has a link in the brand', () => {
    const brandLink = wrapper.find('[data-testid=login-brand-link]')
    expect(brandLink.exists()).toBeTruthy()
    expect(brandLink.attributes('href')).toBe(OFFICIAL_WEBSITE_URL)
  })
})
