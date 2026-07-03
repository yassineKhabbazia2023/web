import type { OnboardingStep, ProspectConformitySection } from './prospect-conformity.enums'

export interface ProspectConformityStep {
  id: OnboardingStep
  // URL/DOM identifier (kebab-case). Decoupled from `id` so the address bar hash
  // and anchor ids stay readable without touching the backend enum contract.
  slug: string
  labelKey: string
  section: ProspectConformitySection
}
