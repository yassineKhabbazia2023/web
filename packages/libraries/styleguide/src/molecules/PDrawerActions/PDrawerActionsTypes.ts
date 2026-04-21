export interface PDrawerActionButton {
  pLabel: string
  pDisabled?: boolean
  pLoading?: boolean
  pTestId?: string
}

export interface PDrawerActionsProps {
  pBackCTA?: PDrawerActionButton
  pSecondaryCTA?: PDrawerActionButton
  pPrimaryCTA?: PDrawerActionButton
}
