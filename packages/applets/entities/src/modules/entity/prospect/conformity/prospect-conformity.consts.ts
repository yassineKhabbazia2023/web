import { ProspectConformitySection } from './prospect-conformity.enums'
import type { ProspectConformityItem } from './prospect-conformity.types'

export const SUPPORTING_DOCS_STEP_ID = 'supporting-docs'

export const COMMERCIAL_PROPOSAL_STEP_ID = 'commercial-proposal'

export const PROSPECT_CONFORMITY_TITLE = 'Étapes'

export const PROSPECT_CONFORMITY_DESCRIPTION = 'Cet espace vous permet de suivre simplement votre accompagnement, de compléter les informations nécessaires et d\'avancer étape par étape avec votre expert.'

export const PROSPECT_CONFORMITY_SECTION_ORDER: readonly ProspectConformitySection[] = [
  ProspectConformitySection.Bases,
  ProspectConformitySection.Documents,
  ProspectConformitySection.Relation,
]

export const PROSPECT_CONFORMITY_BENEFICIARIES_STEP_ID = 'beneficiaries'

export const PROSPECT_CONFORMITY_SECTION_TITLES: Record<ProspectConformitySection, string> = {
  [ProspectConformitySection.Bases]: 'Les bases',
  [ProspectConformitySection.Documents]: 'Les documents',
  [ProspectConformitySection.Relation]: 'Commencer la relation',
}

export const PROSPECT_CONFORMITY_STEPS: readonly ProspectConformityItem[] = [
  { id: PROSPECT_CONFORMITY_BENEFICIARIES_STEP_ID, label: 'Bénéficiaires effectifs', status: 'incomplete', section: ProspectConformitySection.Bases },
  { id: SUPPORTING_DOCS_STEP_ID, label: 'Documents justificatifs', status: 'incomplete', section: ProspectConformitySection.Documents },
  { id: COMMERCIAL_PROPOSAL_STEP_ID, label: 'Proposition commerciale', status: 'incomplete', section: ProspectConformitySection.Documents },
  { id: 'sepa', label: 'Mandat SEPA', status: 'incomplete', section: ProspectConformitySection.Documents },
  { id: 'mission-letter', label: 'Lettre de mission', status: 'incomplete', section: ProspectConformitySection.Relation },
]
