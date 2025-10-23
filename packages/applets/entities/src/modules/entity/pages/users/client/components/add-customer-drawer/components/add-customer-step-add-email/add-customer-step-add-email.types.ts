import type { Contact } from '../../add-customer-drawer.types'

export interface AddCustomerStepAddEmailProps {
  newContact: Contact
  emailErrorMessage: string
  firstNameErrorMessage: string
  lastNameErrorMessage: string
  shouldEnableNames: boolean
}
