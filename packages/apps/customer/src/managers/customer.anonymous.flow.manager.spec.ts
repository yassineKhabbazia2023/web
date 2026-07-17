import { CustomerBootManager } from './customer.boot.manager'
import { initProductFruitsAnonymousCustomer, stopProductFruits } from '@pulse/shared/plugins'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { RouteName } from '@pulse/common/enums'

import { CustomerAnonymousFlowManager } from './customer.anonymous.flow.manager'

beforeEach(() => {
  vi.mocked(initProductFruitsAnonymousCustomer).mockImplementation(() => undefined)
  vi.mocked(stopProductFruits).mockImplementation(() => undefined)
})

describe('CustomerAnonymousFlowManager', () => {
  describe('enterAnonymousFlow', () => {
    it('should clear app storage and state and initialize anonymous third parties', () => {
      const clearAppStorageSpy = vi.spyOn(CustomerBootManager, 'clearAppStorage')
      const clearAppStateSpy = vi.spyOn(CustomerBootManager, 'clearAppState')
      const initAnonymousThirdPartiesSpy = vi.spyOn(CustomerAnonymousFlowManager, 'initAnonymousThirdParties')

      CustomerAnonymousFlowManager.enterAnonymousFlow()

      expect(clearAppStorageSpy).toHaveBeenCalled()
      expect(clearAppStateSpy).toHaveBeenCalled()
      expect(initAnonymousThirdPartiesSpy).toHaveBeenCalled()
    })
  })

  describe('initAnonymousThirdParties', () => {
    it('should initialize anonymous third parties for customer', () => {
      const amplitudeIdentifyCustomerSpy = vi.spyOn(AmplitudeService, 'identifyCustomer')

      CustomerAnonymousFlowManager.initAnonymousThirdParties()

      expect(initProductFruitsAnonymousCustomer).toHaveBeenCalled()
      expect(amplitudeIdentifyCustomerSpy).toHaveBeenCalled()
    })
    it('should NOT throw (and lock the UX) if third parties are broken', () => {
      vi.mocked(initProductFruitsAnonymousCustomer).mockImplementation(() => {
        throw new Error('ProductFruits error')
      })

      expect(() => CustomerAnonymousFlowManager.initAnonymousThirdParties()).not.toThrow()
    })
  })

  describe('exitAnonymousFlow', () => {
    it('should call stopProductFruits', () => {
      CustomerAnonymousFlowManager.exitAnonymousFlow()
      expect(stopProductFruits).toHaveBeenCalled()
    })
    it('should NOT throw (and lock the UX) if third parties are broken', () => {
      vi.mocked(stopProductFruits).mockImplementation(() => {
        throw new Error('ProductFruits error')
      })

      expect(() => CustomerAnonymousFlowManager.exitAnonymousFlow()).not.toThrow()
    })
  })

  describe('getAnonymousRedirection', () => {
    const createMockRoute = (name: string) => ({ name }) as any

    it('should return landing page when navigating to anonymous root', () => {
      const route = createMockRoute(RouteName.ANONYMOUS)
      const result = CustomerAnonymousFlowManager.getAnonymousRedirection(route)

      expect(result).toEqual({ name: RouteName.LOGIN_CLIENT })
    })

    it('should return null when navigating to a specific anonymous route', () => {
      const route = createMockRoute(RouteName.LOGIN_CLIENT)
      const result = CustomerAnonymousFlowManager.getAnonymousRedirection(route)

      expect(result).toBe(null)
    })

    it('should return null when navigating to any other route', () => {
      const route = createMockRoute('some-other-route')
      const result = CustomerAnonymousFlowManager.getAnonymousRedirection(route)

      expect(result).toBe(null)
    })
  })

  describe('getLandingPage', () => {
    it('should return the client login page', () => {
      const result = CustomerAnonymousFlowManager.getLandingPage()

      expect(result).toEqual({ name: RouteName.LOGIN_CLIENT })
    })
  })
})
