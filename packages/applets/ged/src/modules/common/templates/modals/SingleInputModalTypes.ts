
export interface SingleInputModalProps {
  modalTitle: string
  isDialogVisible: boolean
  inputLabel: string
  inputPlaceHolder: string
  confirmBtnabel: string
  cancelBtnLabel: string
  isConfirmButtonDisabled: boolean
  isValidInput: boolean
  showErrorMsg: boolean
  errorMsg: string
  isConfirmButtonLoading: boolean
  defaultInputContentValue?: string
  inputSuffix?: string
  isCentered?: boolean
}

