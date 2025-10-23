export interface ConfirmationModalProps {
  modelValue: boolean
  title: string
  content?: string
  confirmButtonLabel: string
  cancelButtonLabel: string
  isCancelButtonDisabled?: boolean
  isConfirmButtonDisabled?: boolean
  isConfirmButtonLoading?: boolean
}
