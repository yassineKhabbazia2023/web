import type { StepConfig } from './prospect-entity.list.types'
import { ProspectOnboardingStep, ProspectListType } from '@entities/modules/wallet/enums'
import { ProspectColumn } from './prospect-entity.list.enums'

export const PROSPECT_COLUMNS_BY_FLOW: Record<ProspectListType, ProspectColumn[]> = {
  [ProspectListType.PROSPECT_CUSTOMER]: [
    ProspectColumn.COMPANY_NAME,
    ProspectColumn.CUSTOMER_CODE,
    ProspectColumn.LEADER,
    ProspectColumn.EMAIL,
    ProspectColumn.ONBOARDING_STEP,
  ],
  [ProspectListType.PROSPECT_COLLAB]: [
    ProspectColumn.COMPANY_NAME,
    ProspectColumn.CUSTOMER_CODE,
    ProspectColumn.LEADER,
    ProspectColumn.EMAIL,
    ProspectColumn.ONBOARDING_STEP,
    ProspectColumn.OPTIONS,
  ],
}

export const PROSPECT_STEP_CONFIG: Record<ProspectOnboardingStep, StepConfig> = {
  [ProspectOnboardingStep.LEADER_INFO]: { label: 'entities.wallet.prospectSteps.leaderInfo', color: 'light-green' },
  [ProspectOnboardingStep.ENTITY_INFO]: { label: 'entities.wallet.prospectSteps.entityInfo', color: 'light-green' },
  [ProspectOnboardingStep.SUPPORTING_DOCUMENTS]: { label: 'entities.wallet.prospectSteps.supportingDocuments', color: 'light-green' },
  [ProspectOnboardingStep.COMMERCIAL_PROPOSAL]: { label: 'entities.wallet.prospectSteps.commercialProposal', color: 'light-green' },
  [ProspectOnboardingStep.SEPA_MANDATE]: { label: 'entities.wallet.prospectSteps.sepaMandate', color: 'light-green' },
  [ProspectOnboardingStep.GENERAL_ASSEMBLY]: { label: 'entities.wallet.prospectSteps.generalAssembly', color: 'light-green' },
  [ProspectOnboardingStep.ENGAGEMENT_LETTER]: { label: 'entities.wallet.prospectSteps.engagementLetter', color: 'light-green' },
}

export const FALLBACK_STEP_CONFIG: StepConfig = { label: '-', color: 'gray' }
