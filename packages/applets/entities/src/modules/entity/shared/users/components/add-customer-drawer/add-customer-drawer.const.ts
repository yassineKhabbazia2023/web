import { AddCustomerDrawerStep } from '@entities/modules/entity/shared/users/enums'

export const ADD_CUSTOMER_USER_DRAWER_STEPS: AddCustomerDrawerStep[] = [
  AddCustomerDrawerStep.ADD_EMAIL,
  AddCustomerDrawerStep.MANAGE_RIGHTS,
  AddCustomerDrawerStep.FORM_SENT,
]

// Prospect entities cannot be granted rights, so the "manage rights" step is dropped
export const ADD_PROSPECT_USER_DRAWER_STEPS: AddCustomerDrawerStep[] = [
  AddCustomerDrawerStep.ADD_EMAIL,
  AddCustomerDrawerStep.FORM_SENT,
]
