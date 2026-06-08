import type { AddCustomerDrawerStep } from '@entities/modules/entity/shared/users/enums'

export interface AddCustomerStepsProps {
  addCustomerDrawerStepIndex: number
  steps: AddCustomerDrawerStep[]
}
