import type { ProspectProgressStatusConfig } from './prospect-entity.list.types'
import { ProspectProgressStatus, ProspectListType } from '@entities/modules/wallet/enums'
import { ProspectColumn } from './prospect-entity.list.enums'

export const PROSPECT_COLUMNS_BY_FLOW: Record<ProspectListType, ProspectColumn[]> = {
  [ProspectListType.PROSPECT_CUSTOMER]: [
    ProspectColumn.COMPANY_NAME,
    ProspectColumn.CUSTOMER_CODE,
    ProspectColumn.LEADER,
    ProspectColumn.EMAIL,
    ProspectColumn.PROGRESS_STATUS,
  ],
  [ProspectListType.PROSPECT_COLLAB]: [
    ProspectColumn.COMPANY_NAME,
    ProspectColumn.CUSTOMER_CODE,
    ProspectColumn.LEADER,
    ProspectColumn.EMAIL,
    ProspectColumn.PROGRESS_STATUS,
    ProspectColumn.OPTIONS,
  ],
}

export const PROSPECT_PROGRESS_STATUS_CONFIG: Record<ProspectProgressStatus, ProspectProgressStatusConfig> = {
  [ProspectProgressStatus.IDENTITY_DOCUMENTS]: { label: 'entities.wallet.prospectProgressStatuses.identityDocuments', color: 'light-green' },
  [ProspectProgressStatus.BENEFICIARIES_VALIDATION]: { label: 'entities.wallet.prospectProgressStatuses.beneficiariesValidation', color: 'purple' },
  [ProspectProgressStatus.NO_BENEFICIARY]: { label: 'entities.wallet.prospectProgressStatuses.noBeneficiary', color: 'orange' },
  [ProspectProgressStatus.SUPPORTING_DOCUMENTS]: { label: 'entities.wallet.prospectProgressStatuses.supportingDocuments', color: 'light-green' },
  [ProspectProgressStatus.COMMERCIAL_PROPOSAL]: { label: 'entities.wallet.prospectProgressStatuses.commercialProposal', color: 'purple' },
  [ProspectProgressStatus.PAYMENT_METHOD]: { label: 'entities.wallet.prospectProgressStatuses.paymentMethod', color: 'light-green' },
  [ProspectProgressStatus.ENGAGEMENT_LETTER]: { label: 'entities.wallet.prospectProgressStatuses.engagementLetter', color: 'purple' },
  [ProspectProgressStatus.COMPLETED]: { label: 'entities.wallet.prospectProgressStatuses.completed', color: 'green' },
}

export const FALLBACK_PROSPECT_PROGRESS_STATUS_CONFIG: ProspectProgressStatusConfig = { label: '-', color: 'gray' }
