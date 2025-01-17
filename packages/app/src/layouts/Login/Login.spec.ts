import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import Login from './'
import { OFFICIAL_WEBSITE_URL } from '@pulse/core'
import {
  initProductFruits as initProductFruitsMock,
  stopProductFruits as stopProductFruitsMock,
} from '@app/plugins/ProductFruits/productFruits.plugin'

const mockRoute = vi.fn(() => ({
  name: 'mocked route name',
}))
vi.mock('vue-router', () => ({
  useRoute: () => ({
    route: mockRoute,
  }),
}))

vi.mock('env-vars', () => ({
  VITE_PRODUCT_FRUITS_ANONYMOUS_KEY_CLIENT: 'anonymous key client',
}))

vi.mock('@app/plugins/ProductFruits/productFruits.plugin')

const createWrapper = () => shallowMount(Login, {
  global: {
    stubs: {
      'router-view': true,
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
  let wrapper: ReturnType<typeof createWrapper>
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('has links in the footer', () => {
    expect(wrapper.find('.footer').exists()).toBeTruthy()
  })

  it('should call initProductFruits on mounted', async () => {
    expect(initProductFruitsMock).toHaveBeenCalledOnce()
  })

  it('should call stopProductFruits before unmount', () => {
    wrapper.unmount()
    expect(stopProductFruitsMock).toHaveBeenCalledOnce()
  })

  it('has a link in the brand', () => {
    const brandLink = wrapper.find('[data-testid=login-brand-link]')
    expect(brandLink.exists()).toBeTruthy()
    expect(brandLink.attributes('href')).toBe(OFFICIAL_WEBSITE_URL)
  })
})
