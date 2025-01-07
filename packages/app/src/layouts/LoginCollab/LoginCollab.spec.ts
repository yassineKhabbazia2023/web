
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LoginCollab from '.'
import { OFFICIAL_WEBSITE_URL } from '@pulse/core'
import {
  initProductFruits as initProductFruitsMock,
  stopProductFruits as stopProductFruitsMock,
} from '@app/plugins/ProductFruits/productFruits.plugin'

vi.mock('env-vars', () => ({
  VITE_PRODUCT_FRUITS_ANONYMOUS_KEY: 'anonymous key collab',
}))

vi.mock('@app/plugins/ProductFruits/productFruits.plugin')

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
  let wrapper: ReturnType<typeof createWrapper>
  beforeEach(() => {
    wrapper = createWrapper()
  })
  it('should correctly display the login collab page', () => {
    const loginImage = wrapper.findComponent({ name: 'PImage' })
    const loginFooter = wrapper.find('[data-testid=login-collab-footer]')

    expect(loginImage.exists()).toBeTruthy()
    expect(loginFooter.exists()).toBeTruthy()
  })

  it('should call initProductFruits on mounted', () => {
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
