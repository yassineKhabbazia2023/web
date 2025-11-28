import { loggerMock } from '@pulse/toolbox/mocks'
import { CollaboratorBootManager } from './collaborator.boot.manager'
import { createTestingPinia } from '@pinia/testing'
import { initProductFruitsAnonymousCollab, stopProductFruits } from '@pulse/shared/plugins'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { RouteName } from '@pulse/common/enums'

import { CollaboratorAnonymousFlowManager } from './collaborator.anonymous.flow.manager'

createTestingPinia()

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))
vi.mock('@pulse/shared/plugins', () => ({
  initProductFruitsAnonymousCollab: vi.fn(),
  stopProductFruits: vi.fn(),
}))

describe('CollaboratorAnonymousFlowManager', () => {
  describe('enterAnonymousFlow', () => {
    it('should clear app storage and state and initialize anonymous third parties', () => {
      const clearAppStorageSpy = vi.spyOn(CollaboratorBootManager, 'clearAppStorage')
      const clearAppStateSpy = vi.spyOn(CollaboratorBootManager, 'clearAppState')
      const initAnonymousThirdPartiesSpy = vi.spyOn(CollaboratorAnonymousFlowManager, 'initAnonymousThirdParties')

      CollaboratorAnonymousFlowManager.enterAnonymousFlow()

      expect(clearAppStorageSpy).toHaveBeenCalled()
      expect(clearAppStateSpy).toHaveBeenCalled()
      expect(initAnonymousThirdPartiesSpy).toHaveBeenCalled()
    })
  })

  describe('initAnonymousThirdParties', () => {
    it('should initialize anonymous third parties for the right typology of user - collab', () => {
      const amplitudeIdentifyCollaboratorSpy = vi.spyOn(AmplitudeService, 'identifyCollaborator')

      CollaboratorAnonymousFlowManager.initAnonymousThirdParties()

      expect(initProductFruitsAnonymousCollab).toHaveBeenCalled()
      expect(amplitudeIdentifyCollaboratorSpy).toHaveBeenCalled()
    })
  })

  describe('exitAnonymousFlow', () => {
    it('should call stopProductFruits', () => {
      CollaboratorAnonymousFlowManager.exitAnonymousFlow()
      expect(stopProductFruits).toHaveBeenCalled()
    })
    it('should NOT throw (and lock the UX) if third parties are broken', () => {
      vi.mocked(stopProductFruits).mockImplementation(() => {
        throw new Error('ProductFruits error')
      })

      expect(() => CollaboratorAnonymousFlowManager.exitAnonymousFlow()).not.toThrow()
    })
  })

  describe('getAnonymousRedirection', () => {
    const createMockRoute = (name: string) => ({ name }) as any

    it('should return landing page when navigating to anonymous root', () => {
      const route = createMockRoute(RouteName.ANONYMOUS)
      const result = CollaboratorAnonymousFlowManager.getAnonymousRedirection(route)

      expect(result).toEqual({ name: RouteName.LOGIN_COLLAB })
    })

    it('should return null when navigating to a specific anonymous route', () => {
      const route = createMockRoute(RouteName.LOGIN_COLLAB)
      const result = CollaboratorAnonymousFlowManager.getAnonymousRedirection(route)

      expect(result).toBe(null)
    })

    it('should return null when navigating to any other route', () => {
      const route = createMockRoute('some-other-route')
      const result = CollaboratorAnonymousFlowManager.getAnonymousRedirection(route)

      expect(result).toBe(null)
    })
  })

  describe('getLandingPage', () => {
    it('should return the login page', () => {
      const result = CollaboratorAnonymousFlowManager.getLandingPage()

      expect(result).toEqual({ name: RouteName.LOGIN_COLLAB })
    })
  })
})
