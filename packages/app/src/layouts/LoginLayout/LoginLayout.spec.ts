import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import LoginLayout from './'
import {
  initProductFruits as initProductFruitsMock,
  stopProductFruits as stopProductFruitsMock,
} from '@app/plugins/ProductFruits/productFruits.plugin'

const mockRoute = vi.hoisted(() => vi.fn(() => ({
  name: 'mocked route name',
})))
vi.mock('vue-router', () => ({
  useRoute: mockRoute,
}))

vi.mock('env-vars', () => ({
  VITE_PRODUCT_FRUITS_ANONYMOUS_KEY_CLIENT: 'anonymous key client',
  VITE_PRODUCT_FRUITS_ANONYMOUS_KEY: 'anonymous key collab',
}))

vi.mock('@app/plugins/ProductFruits/productFruits.plugin')

const createWrapper = () => shallowMount(LoginLayout, {
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

describe('test LoginLayout', () => {
  const tests = [{
    key: 'collab',
    routeName: 'login',
    expectedKey: 'anonymous key collab',
  }, {
    key: 'client',
    routeName: 'loginClient',
    expectedKey: 'anonymous key client',
  }]
  it.each(tests)('should correctly display the login page when route name is $routeName', ({
    key,
    routeName,
  }) => {
    mockRoute.mockReturnValueOnce({
      name: routeName,
    })
    const wrapper = createWrapper()

    expect(wrapper.html()).toMatchFileSnapshot(`__snap__/LoginLayout.${key}.snap`)
  })

  it.each(tests)('should call initProductFruits on mounted', ({
    routeName,
    expectedKey,
  }) => {
    const expectedParams = {
      key: expectedKey,
      lang: 'fr',
    }
    mockRoute.mockReturnValueOnce({
      name: routeName,
    })
    createWrapper()

    expect(initProductFruitsMock).toHaveBeenCalledOnce()
    expect(initProductFruitsMock).toHaveBeenCalledWith(expectedParams)
  })

  it('should call stopProductFruits before unmount', () => {
    const wrapper = createWrapper()

    wrapper.unmount()
    expect(stopProductFruitsMock).toHaveBeenCalledOnce()
  })
})
