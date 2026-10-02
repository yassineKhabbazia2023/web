export interface PConfirmationPopupProps {
  pIsVisible: boolean
  pTitle?: string
  pConfirmButtonContent: string
  pCancelButtonContent?: string
  pConfirmButtonIsLoading?: boolean
  pConfirmButtonIsDisabled?: boolean
  pAlignCenter?: boolean
  /** Width handed to the underlying dialog; left out, it keeps the dialog default */
  pWidth?: string | number
  pNoCloseButton?: boolean
  pDestroyOnClose?: boolean
  /** Mounts the popup on the body, so that it covers the whole app rather than the block it is declared in */
  pAppendToBody?: boolean
  pTestId?: string
}
