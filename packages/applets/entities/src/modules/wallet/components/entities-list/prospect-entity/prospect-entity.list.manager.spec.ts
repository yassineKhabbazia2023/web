import { ProspectEntityListManager } from './prospect-entity.list.manager'
import { ProspectAction } from './prospect-entity.list.enums'
import { ProspectProgressStatus } from '@entities/modules/wallet/enums'

describe('ProspectEntityListManager', () => {
  describe('getMenuElements', () => {
    it('should expose the resend activation email and archive actions', () => {
      const actionNames = ProspectEntityListManager.getMenuElements().map((element) => element.pActionName)

      expect(actionNames).toContain(ProspectAction.RETRY_MASS_ACTIVATION_EMAIL)
      expect(actionNames).toContain(ProspectAction.ARCHIVE_PROSPECT)
    })
  })

  describe('getProgressStatusConfig', () => {
    it('should return fallback config when progressStatus is null', () => {
      const result = ProspectEntityListManager.getProgressStatusConfig(null)

      expect(result).toEqual({ label: '-', color: 'gray' })
    })

    it.each([
      [ProspectProgressStatus.IDENTITY_DOCUMENTS, 'entities.wallet.prospectProgressStatuses.identityDocuments', 'light-green'],
      [ProspectProgressStatus.BENEFICIARIES_VALIDATION, 'entities.wallet.prospectProgressStatuses.beneficiariesValidation', 'purple'],
      [ProspectProgressStatus.NO_BENEFICIARY, 'entities.wallet.prospectProgressStatuses.noBeneficiary', 'orange'],
      [ProspectProgressStatus.SUPPORTING_DOCUMENTS, 'entities.wallet.prospectProgressStatuses.supportingDocuments', 'light-green'],
      [ProspectProgressStatus.COMMERCIAL_PROPOSAL, 'entities.wallet.prospectProgressStatuses.commercialProposal', 'purple'],
      [ProspectProgressStatus.PAYMENT_METHOD, 'entities.wallet.prospectProgressStatuses.paymentMethod', 'light-green'],
      [ProspectProgressStatus.ENGAGEMENT_LETTER, 'entities.wallet.prospectProgressStatuses.engagementLetter', 'purple'],
      [ProspectProgressStatus.COMPLETED, 'entities.wallet.prospectProgressStatuses.completed', 'green'],
    ])('should return the label and color of %s', (progressStatus, label, color) => {
      const result = ProspectEntityListManager.getProgressStatusConfig(progressStatus)

      expect(result).toEqual({ label, color })
    })
  })
})
