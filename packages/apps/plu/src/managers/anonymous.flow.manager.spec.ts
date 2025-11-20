import { loggerMock } from '@pulse/toolbox/mocks'
import { BootManager } from './boot.manager'
import { createTestingPinia } from '@pinia/testing'
import { initProductFruitsAnonymousCollab, initProductFruitsAnonymousCustomer, stopProductFruits } from '@pulse/shared/plugins'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { RouteName } from '@pulse/common/enums'

import { AnonymousFlowManager } from './anonymous.flow.manager'

createTestingPinia()

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))
vi.mock('@pulse/shared/plugins', () => ({
  initProductFruitsAnonymousCollab: vi.fn(),
  initProductFruitsAnonymousCustomer: vi.fn(),
  stopProductFruits: vi.fn(),
}))

describe('AnonymousFlowManager', () => {
  describe('enterAnonymousFlow', () => {
    it('should clear app storage and state and initialize anonymous third parties', () => {
      const clearAppStorageSpy = vi.spyOn(BootManager, 'clearAppStorage')
      const clearAppStateSpy = vi.spyOn(BootManager, 'clearAppState')
      const initAnonymousThirdPartiesSpy = vi.spyOn(AnonymousFlowManager, 'initAnonymousThirdParties')

      AnonymousFlowManager.enterAnonymousFlow({ routeIsCollab: false })

      expect(clearAppStorageSpy).toHaveBeenCalled()
      expect(clearAppStateSpy).toHaveBeenCalled()
      expect(initAnonymousThirdPartiesSpy).toHaveBeenCalledWith(false)
    })
  })

  describe('initAnonymousThirdParties', () => {
    it('should initialize anonymous third parties for the right typology of user - collab', () => {
      const amplitudeIdentifyCollaboratorSpy = vi.spyOn(AmplitudeService, 'identifyCollaborator')
      const isCollab = true

      AnonymousFlowManager.initAnonymousThirdParties(isCollab)

      expect(initProductFruitsAnonymousCollab).toHaveBeenCalled()
      expect(amplitudeIdentifyCollaboratorSpy).toHaveBeenCalled()
    })
    it('should initialize anonymous third parties for the right typology of user - customer', () => {
      const amplitudeIdentifyCustomerSpy = vi.spyOn(AmplitudeService, 'identifyCustomer')
      const isCollab = false

      AnonymousFlowManager.initAnonymousThirdParties(isCollab)

      expect(initProductFruitsAnonymousCustomer).toHaveBeenCalled()
      expect(amplitudeIdentifyCustomerSpy).toHaveBeenCalled()
    })
    it('should NOT throw (and lock the UX) if third parties are broken', () => {
      vi.mocked(initProductFruitsAnonymousCustomer).mockImplementation(() => {
        throw new Error('ProductFruits error')
      })

      expect(() => AnonymousFlowManager.initAnonymousThirdParties(false)).not.toThrow()
    })
  })

  describe('exitAnonymousFlow', () => {
    it('should call stopProductFruits', () => {
      AnonymousFlowManager.exitAnonymousFlow()
      expect(stopProductFruits).toHaveBeenCalled()
    })
    it('should NOT throw (and lock the UX) if third parties are broken', () => {
      vi.mocked(stopProductFruits).mockImplementation(() => {
        throw new Error('ProductFruits error')
      })

      expect(() => AnonymousFlowManager.exitAnonymousFlow()).not.toThrow()
    })
  })

  describe('getAnonymousRedirection', () => {
    const createMockRoute = (name: string) => ({ name }) as any

    it('should return landing page when navigating to anonymous root', () => {
      const route = createMockRoute(RouteName.ANONYMOUS)
      const result = AnonymousFlowManager.getAnonymousRedirection(route)

      expect(result).toEqual({ name: RouteName.LOGIN_CLIENT })
    })

    it('should return null when navigating to a specific anonymous route', () => {
      const route = createMockRoute(RouteName.LOGIN_CLIENT)
      const result = AnonymousFlowManager.getAnonymousRedirection(route)

      expect(result).toBe(null)
    })

    it('should return null when navigating to any other route', () => {
      const route = createMockRoute('some-other-route')
      const result = AnonymousFlowManager.getAnonymousRedirection(route)

      expect(result).toBe(null)
    })
  })

  describe('getLandingPage', () => {
    it('should return the client login page', () => {
      const result = AnonymousFlowManager.getLandingPage()

      expect(result).toEqual({ name: RouteName.LOGIN_CLIENT })
    })
  })
})
