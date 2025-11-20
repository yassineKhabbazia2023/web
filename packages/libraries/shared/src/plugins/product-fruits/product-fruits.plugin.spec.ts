import {
  initProductFruits,
  initProductFruitsAnonymousCustomer,
  initProductFruitsAnonymousCollab,
  initProductFruitsAuthenticatedCustomer,
  initProductFruitsAuthenticatedCollab,
  getProductFruitsUser,
  stopProductFruits,
  showProductFruits,
  hideProductFruits,
} from './product-fruits.plugin'
import { productFruitConfig, productFruitStatus } from './product-fruits.plugin.state'
import { logger } from '@pulse/toolbox'
import { getBrowserName } from '@pulse/toolbox/utils/browser'
import { initHubspot, openHubspot } from '@shared/plugins/hubspot/hubspot.plugin'
import type { UserInfo } from '@pulse/common/types'
import { productFruits } from 'product-fruits'

vi.mock('@pulse/toolbox', () => ({
  logger: {
    trace: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('@pulse/toolbox/utils/browser', () => ({
  getBrowserName: vi.fn(() => 'chrome'),
}))

vi.mock('@shared/plugins/hubspot/hubspot.plugin', () => ({
  initHubspot: vi.fn(),
  openHubspot: vi.fn(),
}))

vi.mock('product-fruits', () => ({
  productFruits: {
    init: vi.fn(),
  },
}))

const mockedProductFruits = vi.mocked(productFruits)

vi.mock('dayjs', () => {
  const mockDayjs = () => ({
    format: vi.fn(() => '2025-11-19T11:30:00Z[Z]'),
  })
  return {
    default: mockDayjs,
  }
})

vi.mock('env-vars', () => ({
  VITE_PRODUCT_FRUITS_ANONYMOUS_KEY: 'anonymous-key',
  VITE_PRODUCT_FRUITS_ANONYMOUS_KEY_CLIENT: 'anonymous-key-client',
  VITE_PRODUCT_FRUITS_KEY: 'collab-key',
  VITE_PRODUCT_FRUITS_KEY_CLIENT: 'client-key',
}))

vi.mock('./product-fruits.plugin.scss', () => ({}))

declare let window: {
  productFruits: {
    services: {
      destroy: () => void
    }
    api: {
      inAppCenter: {
        show: () => void
        close: () => void
      }
    }
  }
  $productFruits: any
} & Window

const mockProductFruits = {
  services: {
    destroy: vi.fn(),
  },
  api: {
    inAppCenter: {
      show: vi.fn(),
      close: vi.fn(),
    },
  },
}

const clientUserInfoMock: UserInfo = {
  id: 123,
  email: 'client@example.com',
  firstName: 'Alice',
  lastName: 'Johnson',
  isCollab: false,
} as UserInfo

const collabUserInfoMock: UserInfo = {
  id: 456,
  email: 'collab@example.com',
  firstName: 'Charlie',
  lastName: 'Brown',
  isCollab: true,
} as UserInfo

describe('Product Fruits Plugin', () => {
  beforeEach(() => {
    productFruitStatus.isActive = false
    productFruitStatus.isInitialized = false
    productFruitConfig.openChat = undefined
    window.productFruits = mockProductFruits as any
    window.$productFruits = {}
    vi.clearAllMocks()
  })

  describe('initProductFruits()', () => {
    it('should return early if product fruits is not active', () => {
      productFruitStatus.isActive = false

      initProductFruits({ lang: 'fr', key: 'test-key' })

      expect(logger.trace).toHaveBeenCalled()
      expect(mockedProductFruits.init).not.toHaveBeenCalled()
    })

    it('should return early if product fruits is already initialized', () => {
      productFruitStatus.isActive = true
      productFruitStatus.isInitialized = true

      initProductFruits({ lang: 'fr', key: 'test-key' })

      expect(logger.warn).toHaveBeenCalled()
      expect(mockedProductFruits.init).not.toHaveBeenCalled()
    })

    it('should initialize product fruits for anonymous user without chat', () => {
      productFruitStatus.isActive = true

      initProductFruits({ lang: 'fr', key: 'test-key' })

      expect(mockedProductFruits.init).toHaveBeenCalledWith('test-key', 'fr', { username: 'anonymous' })
      expect(productFruitStatus.isInitialized).toBe(true)
      expect(logger.trace).toHaveBeenCalled()
    })

    it('should initialize product fruits with user and browser props', () => {
      productFruitStatus.isActive = true
      const productFruitsUser = getProductFruitsUser(clientUserInfoMock)

      initProductFruits({ lang: 'fr', key: 'test-key', user: productFruitsUser })

      expect(getBrowserName).toHaveBeenCalled()
      expect(mockedProductFruits.init).toHaveBeenCalledWith('test-key', 'fr', {
        ...productFruitsUser,
        props: {
          browser: 'chrome',
        },
      })
      expect(productFruitStatus.isInitialized).toBe(true)
    })

    it('should setup chat and initialize hubspot when openChatCallback is provided', () => {
      productFruitStatus.isActive = true
      const openChatCallback = vi.fn()

      initProductFruits({ lang: 'fr', key: 'test-key', openChatCallback })

      expect(productFruitConfig.openChat).toBe(openChatCallback)
      expect(initHubspot).toHaveBeenCalledWith({
        onHubspotClose: expect.any(Function),
      })
      expect(mockedProductFruits.init).toHaveBeenCalled()
    })
  })

  describe('initProductFruitsAnonymousCustomer()', () => {
    it('should initialize product fruits with anonymous client key', () => {
      productFruitStatus.isActive = true

      initProductFruitsAnonymousCustomer()

      expect(logger.trace).toHaveBeenCalled()
      expect(mockedProductFruits.init).toHaveBeenCalledWith('anonymous-key-client', 'fr', { username: 'anonymous' })
    })
  })

  describe('initProductFruitsAnonymousCollab()', () => {
    it('should initialize product fruits with anonymous collab key', () => {
      productFruitStatus.isActive = true

      initProductFruitsAnonymousCollab()

      expect(logger.trace).toHaveBeenCalled()
      expect(mockedProductFruits.init).toHaveBeenCalledWith('anonymous-key', 'fr', { username: 'anonymous' })
    })
  })

  describe('initProductFruitsAuthenticatedCustomer()', () => {
    it('should log error and return early if no user is provided', () => {
      initProductFruitsAuthenticatedCustomer(undefined)

      expect(logger.error).toHaveBeenCalled()
    })

    it('should initialize product fruits with client key and user', () => {
      productFruitStatus.isActive = true
      const productFruitsUser = getProductFruitsUser(clientUserInfoMock)

      initProductFruitsAuthenticatedCustomer(productFruitsUser)

      expect(logger.trace).toHaveBeenCalled()
      expect(mockedProductFruits.init).toHaveBeenCalledWith(
        'client-key',
        'fr',
        expect.objectContaining({
          username: '123',
          email: 'client@example.com',
        }),
      )
    })
  })

  describe('initProductFruitsAuthenticatedCollab()', () => {
    it('should return early if no user is provided', () => {
      initProductFruitsAuthenticatedCollab(undefined)

      expect(mockedProductFruits.init).not.toHaveBeenCalled()
    })

    it('should initialize product fruits with collab key and user', () => {
      productFruitStatus.isActive = true
      const productFruitsUser = getProductFruitsUser(collabUserInfoMock)

      initProductFruitsAuthenticatedCollab(productFruitsUser)

      expect(logger.trace).toHaveBeenCalled()
      expect(mockedProductFruits.init).toHaveBeenCalledWith(
        'collab-key',
        'fr',
        expect.objectContaining({
          username: '456',
          email: 'collab@example.com',
        }),
      )
    })
  })

  describe('getProductFruitsUser()', () => {
    it('should return undefined and log error if no user is provided', () => {
      const result = getProductFruitsUser(undefined as any)

      expect(logger.error).toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it('should return product fruits user for client user', () => {
      const result = getProductFruitsUser(clientUserInfoMock)

      expect(result).toEqual({
        username: '123',
        email: 'client@example.com',
        firstname: 'Alice',
        lastname: 'Johnson',
        signUpAt: '2025-11-19T11:30:00Z[Z]',
        role: 'Client',
      })
    })

    it('should return product fruits user for collab user', () => {
      const result = getProductFruitsUser(collabUserInfoMock)

      expect(result).toEqual({
        username: '456',
        email: 'collab@example.com',
        firstname: 'Charlie',
        lastname: 'Brown',
        signUpAt: '2025-11-19T11:30:00Z[Z]',
        role: 'Collaborateur',
      })
    })
  })

  describe('stopProductFruits()', () => {
    it('should return early if product fruits is not initialized', () => {
      productFruitStatus.isInitialized = false

      stopProductFruits()

      expect(mockProductFruits.services.destroy).not.toHaveBeenCalled()
    })

    it('should destroy product fruits and clean up', () => {
      productFruitStatus.isInitialized = true
      productFruitConfig.openChat = vi.fn()
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      stopProductFruits()

      expect(mockProductFruits.services.destroy).toHaveBeenCalled()
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'productfruits_button_ext_widget_init',
        expect.any(Function),
      )
      expect(productFruitStatus.isInitialized).toBe(false)
      expect(productFruitConfig.openChat).toBeUndefined()
      expect(window.$productFruits).toBeUndefined()
      expect(logger.trace).toHaveBeenCalled()
    })
  })

  describe('showProductFruits()', () => {
    it('should show product fruits in-app center', () => {
      showProductFruits()

      expect(mockProductFruits.api.inAppCenter.show).toHaveBeenCalled()
      expect(logger.trace).toHaveBeenCalled()
    })

    it('should log error if showing product fruits fails', () => {
      const error = new Error('Test error')
      mockProductFruits.api.inAppCenter.show.mockImplementationOnce(() => {
        throw error
      })

      showProductFruits()

      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('hideProductFruits()', () => {
    it('should hide product fruits in-app center', () => {
      hideProductFruits()

      expect(mockProductFruits.api.inAppCenter.close).toHaveBeenCalled()
      expect(logger.trace).toHaveBeenCalled()
    })

    it('should log error if hiding product fruits fails', () => {
      const error = new Error('Test error')
      mockProductFruits.api.inAppCenter.close.mockImplementationOnce(() => {
        throw error
      })

      hideProductFruits()

      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('Chat integration', () => {
    it('should call openChat callback when productfruits_button_ext_widget_init event is triggered', () => {
      productFruitStatus.isActive = true
      const openChatCallback = vi.fn()

      initProductFruits({ lang: 'fr', key: 'test-key', openChatCallback })

      const event = new Event('productfruits_button_ext_widget_init')
      window.dispatchEvent(event)

      expect(logger.trace).toHaveBeenCalled()
      expect(openChatCallback).toHaveBeenCalled()
    })

    it('should open hubspot when openHubspotChat is called', () => {
      productFruitStatus.isActive = true
      const productFruitsUser = getProductFruitsUser(clientUserInfoMock)

      initProductFruitsAuthenticatedCustomer(productFruitsUser)

      const event = new Event('productfruits_button_ext_widget_init')
      window.dispatchEvent(event)

      expect(logger.trace).toHaveBeenCalled()
      expect(mockProductFruits.api.inAppCenter.close).toHaveBeenCalled()
      expect(openHubspot).toHaveBeenCalled()
    })

    it('should show product fruits when hubspot close callback is triggered', () => {
      productFruitStatus.isActive = true
      const productFruitsUser = getProductFruitsUser(clientUserInfoMock)

      initProductFruitsAuthenticatedCustomer(productFruitsUser)

      const onHubspotClose = (initHubspot as any).mock.calls[0][0].onHubspotClose
      onHubspotClose()

      expect(mockProductFruits.api.inAppCenter.show).toHaveBeenCalled()
    })
  })
})
