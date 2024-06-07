export interface ConfirmationPopupProps {
  isPopupVisible: boolean
  title: string
  message: string
  confirmButtonContent: string
  cancelButtonContent?: string
  isConfirmButtonLoading: boolean
  alignCenter?: boolean
  showClose?: boolean
}
