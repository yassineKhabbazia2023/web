import type { PTagProps } from '@pulse/styleguide/types'
import type { ProspectProgressStatusTag } from './prospect-entity.list.types'
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

export const PROSPECT_PROGRESS_STATUS_COLOR: Record<ProspectProgressStatus, PTagProps['pColor']> = {
  [ProspectProgressStatus.IDENTITY_DOCUMENTS]: 'light-green',
  [ProspectProgressStatus.BENEFICIARIES_VALIDATION]: 'purple',
  [ProspectProgressStatus.NO_BENEFICIARY]: 'orange',
  [ProspectProgressStatus.NO_SIGNATORY]: 'red',
  [ProspectProgressStatus.SUPPORTING_DOCUMENTS]: 'light-green',
  [ProspectProgressStatus.COMMERCIAL_PROPOSAL]: 'purple',
  [ProspectProgressStatus.PAYMENT_METHOD]: 'light-green',
  [ProspectProgressStatus.ENGAGEMENT_LETTER]: 'purple',
  [ProspectProgressStatus.COMPLETED]: 'green',
}

const I18N_COLLAB_KEY = 'entities.wallet.prospectProgressStatuses.prospectCollab'
const I18N_CUSTOMER_KEY = 'entities.wallet.prospectProgressStatuses.prospectCustomer'

export const PROSPECT_PROGRESS_STATUS_LABEL: Record<ProspectListType, Record<ProspectProgressStatus, string>> = {
  [ProspectListType.PROSPECT_COLLAB]: {
    [ProspectProgressStatus.IDENTITY_DOCUMENTS]: `${I18N_COLLAB_KEY}.identityDocuments`,
    [ProspectProgressStatus.BENEFICIARIES_VALIDATION]: `${I18N_COLLAB_KEY}.beneficiariesValidation`,
    [ProspectProgressStatus.NO_BENEFICIARY]: `${I18N_COLLAB_KEY}.noBeneficiary`,
    [ProspectProgressStatus.NO_SIGNATORY]: `${I18N_COLLAB_KEY}.noSignatory`,
    [ProspectProgressStatus.SUPPORTING_DOCUMENTS]: `${I18N_COLLAB_KEY}.supportingDocuments`,
    [ProspectProgressStatus.COMMERCIAL_PROPOSAL]: `${I18N_COLLAB_KEY}.commercialProposal`,
    [ProspectProgressStatus.PAYMENT_METHOD]: `${I18N_COLLAB_KEY}.paymentMethod`,
    [ProspectProgressStatus.ENGAGEMENT_LETTER]: `${I18N_COLLAB_KEY}.engagementLetter`,
    [ProspectProgressStatus.COMPLETED]: `${I18N_COLLAB_KEY}.completed`,
  },
  [ProspectListType.PROSPECT_CUSTOMER]: {
    [ProspectProgressStatus.IDENTITY_DOCUMENTS]: `${I18N_CUSTOMER_KEY}.identityDocuments`,
    [ProspectProgressStatus.BENEFICIARIES_VALIDATION]: `${I18N_CUSTOMER_KEY}.beneficiariesValidation`,
    [ProspectProgressStatus.NO_BENEFICIARY]: `${I18N_CUSTOMER_KEY}.noBeneficiary`,
    [ProspectProgressStatus.NO_SIGNATORY]: `${I18N_CUSTOMER_KEY}.noSignatory`,
    [ProspectProgressStatus.SUPPORTING_DOCUMENTS]: `${I18N_CUSTOMER_KEY}.supportingDocuments`,
    [ProspectProgressStatus.COMMERCIAL_PROPOSAL]: `${I18N_CUSTOMER_KEY}.commercialProposal`,
    [ProspectProgressStatus.PAYMENT_METHOD]: `${I18N_CUSTOMER_KEY}.paymentMethod`,
    [ProspectProgressStatus.ENGAGEMENT_LETTER]: `${I18N_CUSTOMER_KEY}.engagementLetter`,
    [ProspectProgressStatus.COMPLETED]: `${I18N_CUSTOMER_KEY}.completed`,
  },
}

export const FALLBACK_PROSPECT_PROGRESS_STATUS_TAG: ProspectProgressStatusTag = { label: '-', color: 'gray' }
