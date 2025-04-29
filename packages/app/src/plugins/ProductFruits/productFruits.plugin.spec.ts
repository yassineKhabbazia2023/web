// eslint-disable-next-line vitest/no-commented-out-tests
/*
import { type App } from 'vue'
import { describe, it, expect, vi, type MockInstance } from 'vitest'
import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import productFruitsPlugin, {
  onProductFruitsButtonExtWidgetInit,
  stopProductFruits,
  showProductFruits,
  hideProductFruits,
  getProductFruitsOptions,
  initProductFruits,
} from './productFruits.plugin'
import type { ProductFruitUser } from './productFruits.plugin.types'

declare let window: {
  productFruits: {
    services: {
      destroy: () => void
    },
    api: {
      inAppCenter: {
        show: () => void
        close: () => void
      }
    }
  }
} & Window

const MockedBrowserName = 'mocked browser name'
const MockedAnonymous = 'anonymous'

const mockedProductFruitsServicesDestroy = vi.fn(() => {})
const mockedProductFruitsApiInAppCenterShow = vi.fn(() => {})
const mockedProductFruitsApiInAppCenterClose = vi.fn(() => {})

window.productFruits = {
  services: {
    destroy: mockedProductFruitsServicesDestroy,
  },
  api: {
    inAppCenter: {
      show: mockedProductFruitsApiInAppCenterShow,
      close: mockedProductFruitsApiInAppCenterClose,
    },
  },
}

vi.mock('@app/helper', () => ({
  getBrowserName: vi.fn(() => MockedBrowserName),
}))

const mockedProductFruitsInit = vi.hoisted(() => vi.fn())
vi.mock('product-fruits', () => ({
  productFruits: {
    init: mockedProductFruitsInit,
  },
}))

vi.mock('@pulse/core', () => ({ logger: loggerMock }))

const mockedProductFruitsKey = 'mocked product fruits key'
const lang = 'fr'
const key = mockedProductFruitsKey
const mockedOpenChat = vi.fn()

const clientUser: ProductFruitUser = {
  id: 'user id',
  email: 'user@email',
  firstName: 'first name',
  lastName: 'last name',
  isCollab: false,
}

describe('test productFruits plugin', () => {
  beforeEach(() => {
    productFruitsPlugin.install({} as App, {
      isActive: true,
    })
  })

  describe('stopProductFruits', () => {
    let removeEventListenerSpy: MockInstance

    beforeEach(() => {
      removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
      initProductFruits({
        lang,
        key: mockedProductFruitsKey,
        user: clientUser,
        openChat: mockedOpenChat,
      })
      stopProductFruits()
    })

    it('should call window.productFruits.services.destroy', () => {
      expect(mockedProductFruitsServicesDestroy).toHaveBeenCalledOnce()
    })

    it('should remove eventListener', () => {
      const expectedParams = [
        'productfruits_button_ext_widget_init',
        onProductFruitsButtonExtWidgetInit,
      ]

      expect(removeEventListenerSpy).toHaveBeenCalledOnce()
      expect(removeEventListenerSpy).toHaveBeenNthCalledWith(1, ...expectedParams)
    })
  })

  describe('showProductFruits', () => {
    it('should call window.productFruits.api.inAppCenter.show', () => {
      showProductFruits()
      expect(mockedProductFruitsApiInAppCenterShow).toHaveBeenCalledOnce()
    })
  })

  describe('hideProductFruits', () => {
    it('should call window.productFruits.api.inAppCenter.close', () => {
      hideProductFruits()
      expect(mockedProductFruitsApiInAppCenterClose).toHaveBeenCalledOnce()
    })
  })

  describe('getProductFruitsOptions', () => {
    const tests = [{
      user: undefined,
      expectedProductFruitsOptions: {
        username: MockedAnonymous,
      },
      reason: 'user is undefined',
    }, {
      user: clientUser,
      expectedProductFruitsOptions: {
        username: clientUser.id,
        firstname: clientUser.firstName,
        lastname: clientUser.lastName,
        email: clientUser.email,
        role: 'Client',
        props: {
          browser: MockedBrowserName,
        },
      },
      reason: 'user is client',
    }]
    it.each(tests)('Should return $expectedProductFruitsKey when $reason', ({
      user,
      expectedProductFruitsOptions,
    }) => {
      const productFruitsOptions = getProductFruitsOptions(user)

      expect(productFruitsOptions).toStrictEqual(expectedProductFruitsOptions)
    })
  })

  describe('onProductFruitsButtonExtWidgetInit', () => {
    it('should call openChat callback function', () => {
      initProductFruits({
        lang,
        key: mockedProductFruitsKey,
        user: clientUser,
        openChat: mockedOpenChat,
      })

      onProductFruitsButtonExtWidgetInit()

      expect(mockedOpenChat).toHaveBeenCalledOnce()
    })
  })

  describe('initProductFruits', () => {
    it('should call productFruits.init with proper arguments', () => {
      const expectedParams = [
        mockedProductFruitsKey,
        lang,
        {
          username: clientUser.id,
          firstname: clientUser.firstName,
          lastname: clientUser.lastName,
          email: clientUser.email,
          role: 'Client',
          props: {
            browser: MockedBrowserName,
          },
        },
      ]

      initProductFruits({
        lang,
        key: mockedProductFruitsKey,
        user: clientUser,
        openChat: mockedOpenChat,
      })

      expect(mockedProductFruitsInit).toHaveBeenCalledOnce()
      expect(mockedProductFruitsInit).toHaveBeenNthCalledWith(1, ...expectedParams)
    })

    it('should add eventListener', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const expectedParams = [
        'productfruits_button_ext_widget_init',
        onProductFruitsButtonExtWidgetInit,
      ]
      initProductFruits({
        lang,
        key: mockedProductFruitsKey,
        user: clientUser,
        openChat: mockedOpenChat,
      })

      expect(addEventListenerSpy).toHaveBeenCalledOnce()
      expect(addEventListenerSpy).toHaveBeenNthCalledWith(1, ...expectedParams)
    })

    it('should do nothing when is NOT active', () => {
      productFruitsPlugin.install({} as App, {
        isActive: false,
      })

      initProductFruits({ lang, key, user: clientUser, openChat: mockedOpenChat })
      expect(mockedProductFruitsInit).not.toHaveBeenCalled()
    })

    it('should display an error when initProductFruits is called twice', () => {
      const params = {
        lang,
        key: mockedProductFruitsKey,
        user: clientUser,
        openChat: mockedOpenChat,
      }
      initProductFruits(params)
      initProductFruits(params)

      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, 'productFruit is already initialized')
    })
  })
})
*/