import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { envVarsMock } from '@pulse/core/mocks'
import {
  initProductFruits as initProductFruitsMock,
  stopProductFruits as stopProductFruitsMock,
} from '@app/plugins/ProductFruits/productFruits.plugin'
import { LoginRouteName } from '@pulse/common/constants'

import LoginLayout from './'

const mockRoute = vi.hoisted(() => vi.fn(() => ({
  name: 'mocked route name',
})))
vi.mock('vue-router', () => ({
  useRoute: mockRoute,
}))

vi.mock('env-vars', () => envVarsMock)

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
    routeName: LoginRouteName.LOGIN_COLLAB,
    expectedKey: envVarsMock.VITE_PRODUCT_FRUITS_ANONYMOUS_KEY,
  }, {
    key: 'client',
    routeName: LoginRouteName.LOGIN_CLIENT,
    expectedKey: envVarsMock.VITE_PRODUCT_FRUITS_ANONYMOUS_KEY_CLIENT,
  }]
  it.each(tests)('should correctly display the login page when route name is $routeName',
    async ({ key, routeName }) => {
      mockRoute.mockReturnValueOnce({
        name: routeName,
      })
      const wrapper = createWrapper()

      await expect(wrapper.html()).toMatchFileSnapshot(`__snap__/LoginLayout.${key}.snap`)
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
