export interface OldRydgeInvoicesDialogProps {
  loginUrl: string
}

export interface OldRydgeInvoicesDialogEmits {
  (event: 'login-click'): void
  (event: 'assistance-click'): void
}
