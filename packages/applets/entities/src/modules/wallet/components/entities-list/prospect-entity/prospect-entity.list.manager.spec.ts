import { ProspectEntityListManager } from './prospect-entity.list.manager'
import { ProspectAction } from './prospect-entity.list.enums'
import { ProspectListType, ProspectProgressStatus } from '@entities/modules/wallet/enums'

const PROGRESS_STATUS_CASES: [ProspectProgressStatus, string, string][] = [
  [ProspectProgressStatus.IDENTITY_DOCUMENTS, 'identityDocuments', 'light-green'],
  [ProspectProgressStatus.BENEFICIARIES_VALIDATION, 'beneficiariesValidation', 'purple'],
  [ProspectProgressStatus.NO_BENEFICIARY, 'noBeneficiary', 'orange'],
  [ProspectProgressStatus.SUPPORTING_DOCUMENTS, 'supportingDocuments', 'light-green'],
  [ProspectProgressStatus.COMMERCIAL_PROPOSAL, 'commercialProposal', 'purple'],
  [ProspectProgressStatus.PAYMENT_METHOD, 'paymentMethod', 'light-green'],
  [ProspectProgressStatus.ENGAGEMENT_LETTER, 'engagementLetter', 'purple'],
  [ProspectProgressStatus.COMPLETED, 'completed', 'green'],
]

describe('ProspectEntityListManager', () => {
  describe('getMenuElements', () => {
    it('should expose the resend activation email and archive actions', () => {
      const actionNames = ProspectEntityListManager.getMenuElements().map((element) => element.pActionName)

      expect(actionNames).toContain(ProspectAction.RETRY_MASS_ACTIVATION_EMAIL)
      expect(actionNames).toContain(ProspectAction.ARCHIVE_PROSPECT)
    })
  })

  describe('getProgressStatusTag', () => {
    it.each([
      [ProspectListType.PROSPECT_COLLAB],
      [ProspectListType.PROSPECT_CUSTOMER],
    ])('should return fallback tag when progressStatus is null for %s', (prospectListType) => {
      const result = ProspectEntityListManager.getProgressStatusTag(null, prospectListType)

      expect(result).toEqual({ label: '-', color: 'gray' })
    })

    it.each(PROGRESS_STATUS_CASES)('should return the collaborator label and color of %s', (progressStatus, labelKey, color) => {
      const result = ProspectEntityListManager.getProgressStatusTag(progressStatus, ProspectListType.PROSPECT_COLLAB)

      expect(result).toEqual({ label: `entities.wallet.prospectProgressStatuses.prospectCollab.${labelKey}`, color })
    })

    it.each(PROGRESS_STATUS_CASES)('should return the customer label and color of %s', (progressStatus, labelKey, color) => {
      const result = ProspectEntityListManager.getProgressStatusTag(progressStatus, ProspectListType.PROSPECT_CUSTOMER)

      expect(result).toEqual({ label: `entities.wallet.prospectProgressStatuses.prospectCustomer.${labelKey}`, color })
    })
  })
})
