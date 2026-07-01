import { ProspectCreationDrawerStep } from '@entities/modules/wallet/enums'

export const PROSPECT_CREATION_DRAWER_STEPS: ProspectCreationDrawerStep[] = [
  ProspectCreationDrawerStep.INFORMATION,
  ProspectCreationDrawerStep.COMPANY,
  ProspectCreationDrawerStep.CONTACT,
]

// Backend referential key for the signatory contact type. This role is mandatory:
// the created leader is always the engagement-letter / mandate signatory, so the
// option is pre-selected and locked in the "Type de contact" field.
export const SIGNATORY_CONTACT_TYPE = 'isMandateSignatory'
