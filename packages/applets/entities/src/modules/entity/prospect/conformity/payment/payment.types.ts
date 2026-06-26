import type { IconName } from '@pulse/styleguide/types'
import type { PaymentFooterAction } from './payment.enums'

export interface PaymentProps {
  isCollaborator?: boolean
}

export interface PaymentFooterButton {
  label: string
  action: PaymentFooterAction
  type: 'primary' | 'secondary'
  trailingIcon?: IconName
  // When true, clicking the button opens a confirmation popup and only runs the action once confirmed.
  requiresConfirmation?: boolean
}

export interface PaymentBenefit {
  iconName: IconName
  labelKey: string
  textKey: string
}

export interface UsePaymentOptions {
  // Notification shown when a payment preference mutation fails.
  updateErrorMessage: string
  // Notification shown when downloading the signed SEPA mandate fails.
  downloadErrorMessage: string
}
