import { AmplitudeService } from '@pulse/common/services/amplitude'
import { PennylaneCustomerAccessRightsTrackingManager } from './pennylane-customer-access-rights-tracking.manager'

describe('PennylaneCustomerAccessRightsTrackingManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('track', () => {
    it('should track pennylane access rights with succeeded result for new user', () => {
      PennylaneCustomerAccessRightsTrackingManager.track({
        localisation: 'ajout nouvel utilisateur client',
        roleLabel: 'Dirigeant/Admin',
        result: 'succeeded',
      })

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Client Access Rights Completed',
        {
          client_access_rights_name: 'pennylane',
          client_access_rights_role: 'Dirigeant/Admin',
          client_access_rights_localisation: 'ajout nouvel utilisateur client',
          client_access_rights_result: 'succeeded',
        },
      )
    })

    it('should track pennylane access rights with failed result for new user', () => {
      PennylaneCustomerAccessRightsTrackingManager.track({
        localisation: 'ajout nouvel utilisateur client',
        roleLabel: 'Gestionnaire de facturation',
        result: 'failed',
      })

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Client Access Rights Completed',
        {
          client_access_rights_name: 'pennylane',
          client_access_rights_role: 'Gestionnaire de facturation',
          client_access_rights_localisation: 'ajout nouvel utilisateur client',
          client_access_rights_result: 'failed',
        },
      )
    })

    it('should track pennylane access rights with succeeded result for rights modification', () => {
      PennylaneCustomerAccessRightsTrackingManager.track({
        localisation: 'modification de droits client',
        roleLabel: 'Employé',
        result: 'succeeded',
      })

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Client Access Rights Completed',
        {
          client_access_rights_name: 'pennylane',
          client_access_rights_role: 'Employé',
          client_access_rights_localisation: 'modification de droits client',
          client_access_rights_result: 'succeeded',
        },
      )
    })

    it('should track pennylane access rights with failed result for rights modification', () => {
      PennylaneCustomerAccessRightsTrackingManager.track({
        localisation: 'modification de droits client',
        roleLabel: 'Gestionnaire de facturation client',
        result: 'failed',
      })

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Client Access Rights Completed',
        {
          client_access_rights_name: 'pennylane',
          client_access_rights_role: 'Gestionnaire de facturation client',
          client_access_rights_localisation: 'modification de droits client',
          client_access_rights_result: 'failed',
        },
      )
    })
  })
})
