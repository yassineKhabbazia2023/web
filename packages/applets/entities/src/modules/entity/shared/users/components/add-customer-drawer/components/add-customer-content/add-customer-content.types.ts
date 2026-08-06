import type { AddCustomerDrawerStep } from '@entities/modules/entity/shared/users/enums'
import type { PDropdownOption } from '@pulse/styleguide/types'
import type { Contact } from '../../add-customer-drawer.types'

export interface AddCustomerContentProps {
  newContact: Contact
  contactId?: number
  entityId: number
  accountNumber: string
  isProspect: boolean
  hasFormSubmissionFailed: boolean
  emailErrorMessage: string
  firstNameErrorMessage: string
  lastNameErrorMessage: string
  customerTitleOptions: PDropdownOption[]
  shouldEnableNames: boolean
  addCustomerDrawerStepIndex: number
  addCustomerDrawerStep: AddCustomerDrawerStep
  stepperSteps: AddCustomerDrawerStep[]
}
