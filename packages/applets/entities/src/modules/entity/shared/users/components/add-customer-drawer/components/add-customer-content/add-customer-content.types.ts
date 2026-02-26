import type { AddCustomerDrawerStep } from '@entities/modules/entity/shared/users/enums'
import type { Contact } from '../../add-customer-drawer.types'

export interface AddCustomerContentProps {
  newContact: Contact
  contactId?: number
  entityId: number
  accountNumber: string
  hasFormSubmissionFailed: boolean
  emailErrorMessage: string
  firstNameErrorMessage: string
  lastNameErrorMessage: string
  shouldEnableNames: boolean
  addCustomerDrawerStepIndex: number
  addCustomerDrawerStep: AddCustomerDrawerStep
}
