import { BootManager } from './boot.manager'
import { createTestingPinia } from '@pinia/testing'
import { initProductFruitsAnonymousCollab, initProductFruitsAnonymousCustomer, stopProductFruits } from '@app/plugins/ProductFruits/productFruits.plugin'
import { AmplitudeService } from '@pulse/common/services/amplitude'

import { AnonymousFlowManager } from './anonymous.flow.manager'

createTestingPinia()


vi.mock('@app/plugins/ProductFruits/productFruits.plugin', () => ({
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
  })

  describe('exitAnonymousFlow', () => {
    it('should call stopProductFruits', () => {
      AnonymousFlowManager.exitAnonymousFlow()
      expect(stopProductFruits).toHaveBeenCalled()
    })
  })
})
