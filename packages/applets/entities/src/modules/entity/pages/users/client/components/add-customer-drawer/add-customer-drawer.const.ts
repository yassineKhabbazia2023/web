import { AddCustomerDrawerStep } from '@entities/modules/entity/enums'

export const DEBOUNCE_DELAY = 600

export const ADD_CUSTOMER_DRAWER_STEPS: AddCustomerDrawerStep[] = [
  AddCustomerDrawerStep.ADD_EMAIL,
  AddCustomerDrawerStep.MANAGE_RIGHTS,
  AddCustomerDrawerStep.FORM_SENT,
]
