import { ProspectEntityListManager } from './prospect-entity.list.manager'
import { ProspectOnboardingStep } from '@entities/modules/wallet/enums'

describe('ProspectEntityListManager', () => {
  describe('getStepConfig', () => {
    it('should return fallback config when stepCode is null', () => {
      const result = ProspectEntityListManager.getStepConfig(null)

      expect(result).toEqual({ label: '-', color: 'gray' })
    })

    it('should return matching step config for a known step', () => {
      const result = ProspectEntityListManager.getStepConfig(ProspectOnboardingStep.LEADER_INFO)

      expect(result).toEqual({ label: 'entities.wallet.prospectSteps.leaderInfo', color: 'light-green' })
    })

    it('should return matching config for each known step', () => {
      const result = ProspectEntityListManager.getStepConfig(ProspectOnboardingStep.ENTITY_INFO)

      expect(result).toEqual({ label: 'entities.wallet.prospectSteps.entityInfo', color: 'light-green' })
    })
  })
})
