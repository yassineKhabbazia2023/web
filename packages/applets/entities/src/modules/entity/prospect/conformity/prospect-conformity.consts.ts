import { OnboardingStep, ProspectConformitySection } from './prospect-conformity.enums'
import type { ProspectConformityStep } from './prospect-conformity.types'

const I18N_KEY = 'entities.prospect.conformity'

export const PROSPECT_CONFORMITY_SECTION_ORDER: readonly ProspectConformitySection[] = [
  ProspectConformitySection.Identity,
  ProspectConformitySection.Documents,
  ProspectConformitySection.Mission,
]

export const PROSPECT_CONFORMITY_SECTION_TITLE_KEYS: Record<ProspectConformitySection, string> = {
  [ProspectConformitySection.Identity]: `${I18N_KEY}.sections.identity`,
  [ProspectConformitySection.Documents]: `${I18N_KEY}.sections.documents`,
  [ProspectConformitySection.Mission]: `${I18N_KEY}.sections.mission`,
}

// URL/DOM slug for each backend step. The enum values are the backend contract
// (sent/received by the API) and must stay untouched, so this map is the single
// source of truth for the kebab-case identifier shown in the address bar hash.
export const PROSPECT_CONFORMITY_STEP_SLUGS: Record<OnboardingStep, string> = {
  [OnboardingStep.Beneficiary]: 'beneficiaires-effectifs',
  [OnboardingStep.SupportingDocuments]: 'documents-justificatifs',
  [OnboardingStep.CommercialProposal]: 'proposition-commerciale',
  [OnboardingStep.PaymentMethod]: 'moyens-de-paiement',
  [OnboardingStep.EngagementLetter]: 'lettre-de-mission',
}

export const PROSPECT_CONFORMITY_STEPS: readonly ProspectConformityStep[] = [
  { id: OnboardingStep.Beneficiary, slug: PROSPECT_CONFORMITY_STEP_SLUGS[OnboardingStep.Beneficiary], labelKey: `${I18N_KEY}.steps.beneficiary`, section: ProspectConformitySection.Identity },
  { id: OnboardingStep.SupportingDocuments, slug: PROSPECT_CONFORMITY_STEP_SLUGS[OnboardingStep.SupportingDocuments], labelKey: `${I18N_KEY}.steps.supportingDocuments`, section: ProspectConformitySection.Documents },
  { id: OnboardingStep.CommercialProposal, slug: PROSPECT_CONFORMITY_STEP_SLUGS[OnboardingStep.CommercialProposal], labelKey: `${I18N_KEY}.steps.commercialProposal`, section: ProspectConformitySection.Documents },
  { id: OnboardingStep.PaymentMethod, slug: PROSPECT_CONFORMITY_STEP_SLUGS[OnboardingStep.PaymentMethod], labelKey: `${I18N_KEY}.steps.paymentMethod`, section: ProspectConformitySection.Documents },
  { id: OnboardingStep.EngagementLetter, slug: PROSPECT_CONFORMITY_STEP_SLUGS[OnboardingStep.EngagementLetter], labelKey: `${I18N_KEY}.steps.engagementLetter`, section: ProspectConformitySection.Mission },
]
