export interface ConformityStepCardProps {
  pTitle: string
  // When set, renders id="step-<pStepId>" so the scrollspy/tracker can anchor to this card.
  pStepId?: string
  // Hide the title header for steps whose content manages its own header (e.g. payment).
  pHideTitle?: boolean
}
